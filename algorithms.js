class Algorithm {
  constructor() {
    this.width = 100;
    this.height = 100;

    this.backgroundColor = 255;
    this.foregroundColor = 0;

    this.squareSize = 16;

    return this;
  }

  setColors(backgroundColor, foregroundColor) {
    this.backgroundColor = backgroundColor;
    this.foregroundColor = foregroundColor;

    return this;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

    return this;
  }

  setSquareSize(size) {
    this.squareSize = size;
  }

  init() {}

  run() {}
}

class MarchingSquares extends Algorithm {
  constructor() {
    super();

    this.pointValues = [];
    this.squareXAmount = 0;
    this.squareYAmount = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.time = 0;
  }

  init() {
    super.init();

    this.time = 0;

    this.squareXAmount = Math.floor(this.width / this.squareSize);
    this.squareYAmount = Math.floor(this.height / this.squareSize);

    this.xOffset = (this.width - this.squareXAmount * this.squareSize) / 2;
    this.yOffset = (this.height - this.squareYAmount * this.squareSize) / 2;

    for (let i = 0; i < this.squareXAmount + 1; i++) {
      this.pointValues.push([]);
      for (let j = 0; j < this.squareYAmount + 1; j++) {
        this.pointValues[i].push(round(noise(i / 10, j / 10)));
      }
    }
  }

  #drawLines(total, x, y) {
    strokeWeight(4);
    stroke(this.foregroundColor);
    switch (total) {
      case 0:
        break;
      case 1:
        line(
          x,
          y + this.squareSize / 2,
          x + this.squareSize / 2,
          y + this.squareSize
        );
        break;
      case 2:
        line(
          x + this.squareSize / 2,
          y + this.squareSize,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 3:
        line(
          x,
          y + this.squareSize / 2,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 4:
        line(
          x + this.squareSize / 2,
          y,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 5:
        line(x, y + this.squareSize / 2, x + this.squareSize / 2, y);
        line(
          x + this.squareSize / 2,
          y + this.squareSize,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 6:
        line(
          x + this.squareSize / 2,
          y,
          x + this.squareSize / 2,
          y + this.squareSize
        );
        break;
      case 7:
        line(x, y + this.squareSize / 2, x + this.squareSize / 2, y);
        break;
      case 8:
        line(x, y + this.squareSize / 2, x + this.squareSize / 2, y);
        break;
      case 9:
        line(
          x + this.squareSize / 2,
          y,
          x + this.squareSize / 2,
          y + this.squareSize
        );
        break;
      case 10:
        line(
          x,
          y + this.squareSize / 2,
          x + this.squareSize / 2,
          y + this.squareSize
        );
        line(
          x + this.squareSize / 2,
          y,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 11:
        line(
          x + this.squareSize / 2,
          y,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 12:
        line(
          x,
          y + this.squareSize / 2,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 13:
        line(
          x + this.squareSize / 2,
          y + this.squareSize,
          x + this.squareSize,
          y + this.squareSize / 2
        );
        break;
      case 14:
        line(
          x,
          y + this.squareSize / 2,
          x + this.squareSize / 2,
          y + this.squareSize
        );
        break;
      case 15:
        break;
    }
  }

  run() {
    super.run();

    background(this.backgroundColor);

    for (let i = 0; i < this.pointValues.length - 1; i++) {
      for (let j = 0; j < this.pointValues[i].length - 1; j++) {
        let total =
          this.pointValues[i][j] * 8 +
          this.pointValues[i + 1][j] * 4 +
          this.pointValues[i + 1][j + 1] * 2 +
          this.pointValues[i][j + 1] * 1;

        this.#drawLines(
          total,
          i * this.squareSize + this.xOffset,
          j * this.squareSize + this.yOffset
        );
        this.pointValues[i][j] = round(noise(i / 10, j / 10, this.time));
      }
    }
    this.time += 0.0005;
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.5;
    this.maxSpeed = 10;
  }

  update(width, height) {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.set(0, 0);

    if (this.position.x > width) this.position.x -= width;
    if (this.position.x < 0) this.position.x += width;
    if (this.position.y > height) this.position.y -= height;
    if (this.position.y < 0) this.position.y += height;
  }

  draw(color) {
    noStroke();
    fill(color);
    ellipse(this.position.x, this.position.y, 16);
  }

  flock(boids) {
    this.acceleration.add(this.#align(boids));
    this.acceleration.add(this.#cohesion(boids));
    this.acceleration.add(this.#seperation(boids).mult(2));
  }

  #align(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let boid of boids) {
      if (boid == this) continue;
      if (this.position.dist(boid.position) > perceptionRadius) continue;
      steering.add(boid.velocity);
      total++;
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  #cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;

    for (let boid of boids) {
      if (boid == this) continue;
      if (this.position.dist(boid.position) > perceptionRadius) continue;

      steering.add(boid.position);
      total++;
    }

    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  #seperation(boids) {
    let perceptionRadius = 50;
    let steering = createVector(0, 0);
    let total = 0;

    for (let boid of boids) {
      if (boid == this) continue;
      let distance = this.position.dist(boid.position);
      if (distance > perceptionRadius) continue;
      let difference = p5.Vector.sub(this.position, boid.position);
      difference.div(distance * distance);
      steering.add(difference);
      total++;
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
}

class Boids extends Algorithm {
  constructor() {
    super();

    this.boids = [];
    this.amount = 150;
  }

  init() {
    super.init();

    for (let i = 0; i < this.amount; i++) {
      this.boids.push(new Boid(random(0, width), random(0, height)));
    }
  }

  run() {
    super.run();

    background(this.backgroundColor);

    this.boids.forEach((boid) => {
      boid.flock(this.boids);
      boid.update(this.width, this.height);
    });

    this.boids.forEach((boid) => {
      boid.draw(this.foregroundColor);
    });
  }
}

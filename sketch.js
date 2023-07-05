let button = document.getElementById("darkmodeToggle");
let darkmode = JSON.parse(localStorage.getItem("darkmode")) || false;

let foregroundColor = "#202020";
let backgroundColor = "#F7F0F0";

let squareSize = 16;
let xOffset = 0;
let yOffset = 0;

let time = 0;

let points = [];

function toggleDarkmode(toggle) {
  darkmode = toggle ? !darkmode : darkmode;
  if (darkmode) {
    button.classList.add("on");
    document.body.classList.add("darkmode");
    foregroundColor = "#F7F0F0";
    backgroundColor = "#202020";
  } else {
    button.classList.remove("on");
    document.body.classList.remove("darkmode");
    foregroundColor = "#202020";
    backgroundColor = "#F7F0F0";
  }
  localStorage.setItem("darkmode", darkmode);
}

toggleDarkmode(false);

function drawMarchingSquare(a, b, c, d, x, y) {
  let total = a * 8 + b * 4 + c * 2 + d * 1;

  stroke(foregroundColor);
  strokeWeight(4);
  switch (total) {
    case 0:
      break;
    case 1:
      line(x, y + squareSize / 2, x + squareSize / 2, y + squareSize);
      break;
    case 2:
      line(
        x + squareSize / 2,
        y + squareSize,
        x + squareSize,
        y + squareSize / 2
      );
      break;
    case 3:
      line(x, y + squareSize / 2, x + squareSize, y + squareSize / 2);
      break;
    case 4:
      line(x + squareSize / 2, y, x + squareSize, y + squareSize / 2);
      break;
    case 5:
      line(x, y + squareSize / 2, x + squareSize / 2, y);
      line(
        x + squareSize / 2,
        y + squareSize,
        x + squareSize,
        y + squareSize / 2
      );
      break;
    case 6:
      line(x + squareSize / 2, y, x + squareSize / 2, y + squareSize);
      break;
    case 7:
      line(x, y + squareSize / 2, x + squareSize / 2, y);
      break;
    case 8:
      line(x, y + squareSize / 2, x + squareSize / 2, y);
      break;
    case 9:
      line(x + squareSize / 2, y, x + squareSize / 2, y + squareSize);
      break;
    case 10:
      line(x, y + squareSize / 2, x + squareSize / 2, y + squareSize);
      line(x + squareSize / 2, y, x + squareSize, y + squareSize / 2);
      break;
    case 11:
      line(x + squareSize / 2, y, x + squareSize, y + squareSize / 2);
      break;
    case 12:
      line(x, y + squareSize / 2, x + squareSize, y + squareSize / 2);
      break;
    case 13:
      line(
        x + squareSize / 2,
        y + squareSize,
        x + squareSize,
        y + squareSize / 2
      );
      break;
    case 14:
      line(x, y + squareSize / 2, x + squareSize / 2, y + squareSize);
      break;
    case 15:
      break;
  }

  return total;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  let squareXAmount = Math.floor(width / squareSize);
  let squareYAmount = Math.floor(height / squareSize);

  xOffset = (width - squareXAmount * squareSize) / 2;
  yOffset = (height - squareYAmount * squareSize) / 2;

  for (let i = 0; i < squareXAmount + 1; i++) {
    points.push([]);
    for (let j = 0; j < squareYAmount + 1; j++) {
      points[i].push(round(noise(i / 10, j / 10)));
    }
  }

  textAlign(CENTER, CENTER);
}

function draw() {
  background(backgroundColor);

  noStroke();
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < points[i].length - 1; j++) {
      let total = drawMarchingSquare(
        points[i][j],
        points[i + 1][j],
        points[i + 1][j + 1],
        points[i][j + 1],
        i * squareSize + xOffset,
        j * squareSize + yOffset
      );

      points[i][j] = round(noise(i / 10, j / 10, time));
    }
  }

  time += 0.0005;
}

button.addEventListener("click", () => {
  toggleDarkmode(true);
});

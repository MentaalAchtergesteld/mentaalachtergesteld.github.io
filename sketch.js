let button = document.getElementById("darkmodeToggle");
let darkmode = JSON.parse(localStorage.getItem("darkmode")) || false;

let foregroundColor = "#202020";
let backgroundColor = "#F7F0F0";

let algorithms = new Map();

algorithms.set("marchingSquares", new MarchingSquares());
algorithms.set("boids", new Boids());

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

  algorithms.forEach((algorithm) => {
    algorithm.setColors(backgroundColor, foregroundColor);
  });
  localStorage.setItem("darkmode", darkmode);
}

toggleDarkmode(false);

function setAlgorithm(name) {
  if (algorithms.has(name)) {
    currentAlgorithm = algorithms.get(name);
    return true;
  } else {
    return false;
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  let selectedAlgorithm = round(random(algorithms.size - 1));
  console.log(selectedAlgorithm);
  let cur = 0;
  algorithms.forEach((algorithm) => {
    algorithm
      .setSize(width, height)
      .setColors(backgroundColor, foregroundColor)
      .init();

    if (cur == selectedAlgorithm) currentAlgorithm = algorithm;
    cur++;
  });
}

function draw() {
  currentAlgorithm.run();
}

button.addEventListener("click", () => {
  toggleDarkmode(true);
});

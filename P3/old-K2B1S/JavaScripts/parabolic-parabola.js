import {
  CanvasElement,
  OneStone,
  TimeScore,
  Twobirds,
} from "./parabolic-classes.js";

let v_frame = 0; //! Maneja los frames pero hay una cosita llamada DeltaTime

const isGameOver = {
  //! entiendo lo de la semántica y tal pero esto es un bool man.
  win: false,
  lose: false,
};

console.log("Ejecutando JS...");

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// -------------------------------------- DRAWING PAD ------------------------------------
const drawingPad = document.getElementById("drawing-pad");
drawingPad.width = window.innerWidth / 4;
drawingPad.height = window.innerHeight / 2;

const drawingLimits = [drawingPad.width, drawingPad.height];

//? Panel de control para el dibujo
//! Haz una clase de verdad no seas pusi
//! Dentro, controla todo, incluido el elemento HTML y sus eventos

const drawingPadController = {
  isDrawable: true,
  isDrawing: false,

  x0: 0,
  y0: 0,
  x1: 0,
  y1: 0,

  xAux: 0,
  yAux: 0,

  getInitialSpeed: function (stone) {
    const dx = (this.x1 - this.x0) / drawingLimits[0];
    const dy = (this.y0 - this.y1) / drawingLimits[1];
    const strength = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(dy, dx);

    stone.setInitialSpeed([
      strength * Math.cos(theta),
      strength * Math.sin(theta),
    ]);
  },
};

drawingPad.addEventListener("mousedown", function (e) {
  if (drawingPadController.isDrawable && !drawingPadController.isDrawing) {
    drawingPadController.isDrawing = true;
    drawingPadController.x0 = e.offsetX;
    drawingPadController.y0 = e.offsetY;
    drawingPadController.xAux = e.offsetX;
    drawingPadController.yAux = e.offsetY;
  }
});

drawingPad.addEventListener("mousemove", function (e) {
  if (drawingPadController.isDrawable && drawingPadController.isDrawing) {
    const ctx = drawingPad.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(drawingPadController.xAux, drawingPadController.yAux);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    drawingPadController.xAux = e.offsetX;
    drawingPadController.yAux = e.offsetY;

    if (
      drawingPadController.xAux > drawingLimits[0] ||
      drawingPadController.yAux > drawingLimits[1]
    ) {
      drawingPadController.isDrawing = false;
      drawingPadController.isDrawable = false;
      drawingPadController.x1 = drawingPadController.xAux;
      drawingPadController.y1 = drawingPadController.yAux;
      drawingPadController.getInitialSpeed(stone);
    }
  }
});

// -------------------------------------- GAME ELEMENTS ------------------------------------

const screen = new CanvasElement(
  "canvas",
  "Screen",
  [0.5, 0.525, 1.0, 0.95, 1.0, 0.95]
);
const stone = new OneStone(
  "canvas",
  "Stone",
  [0.1, 0.1, 0.2, 0.2, 0.1, 0.1],
  9.81
);

const easyInput = document.getElementById("easy");
const hardInput = document.getElementById("hard");
const insaneInput = document.getElementById("insane");

if (easyInput.checked) {
  stone.setDifficulty("easy");
} else if (hardInput.checked) {
  stone.setDifficulty("hard");
} else if (insaneInput.checked) {
  stone.setDifficulty("insane");
}

drawingPad.addEventListener("mouseup", function (e) {
  if (drawingPadController.isDrawable & drawingPadController.isDrawing) {
    drawingPadController.isDrawing = false;
    drawingPadController.isDrawable = false;
    drawingPadController.x1 = drawingPadController.xAux;
    drawingPadController.y1 = drawingPadController.yAux;
    drawingPadController.getInitialSpeed(stone);
  }
});

function generateBirdPosition() {
  const minX = 1 / 4;
  const maxX = 1 - 1 / 8;
  const minY = 1 / 8;
  const maxY = 1 - 1 / 8;

  let x = Math.random() * (maxX - minX) + minX;
  let y = Math.random() * (maxY - minY) + minY;

  return [x, y];
}

function generateBird2Position(firstPosition) {
  const secondPosition = generateBirdPosition();
  const dx = secondPosition[0] - firstPosition[0];
  const dy = secondPosition[1] - firstPosition[1];
  if (Math.abs(dx) > 1 / 6 || Math.abs(dy) > 1 / 6) {
    generateBird2Position(firstPosition);
  }
  return secondPosition;
}

const blueBirdPosition = generateBirdPosition();
const greenBirdPosition = generateBird2Position(blueBirdPosition);

const timer = new TimeScore(
  "canvas",
  "TimeScore",
  [0.95, 0.85, 0.4, 0.2, 0.4, 0.2]
);
const blue_bird = new Twobirds("canvas", "BlueBird", [
  blueBirdPosition[0],
  blueBirdPosition[1],
  0.15,
  0.15,
  0.05 / 2,
  0.1,
]);
const green_bird = new Twobirds("canvas", "GreenBird", [
  greenBirdPosition[0],
  greenBirdPosition[1],
  0.15,
  0.15,
  0.05 / 2,
  0.1,
]);

stone.colisioner.addTimeScore(timer);
stone.colisioner.add0(screen.colider());
stone.colisioner.add(blue_bird.colider());
stone.colisioner.add(green_bird.colider());

const tutorialDisplay = document.getElementById("tutorial-shade");
const tutorialCloseBotton = document.getElementById("tutorial-close");

tutorialCloseBotton.addEventListener("click", function () {
  window.requestAnimationFrame(step);
  tutorialDisplay.style.display = "none";

  let music = new Audio("BirdsonaWire.mp3");
  music.currentTime = 0;
  music.play();
});

function step(i) {
  v_frame += 1;

  screen.clear();

  timer.setTime();
  stone.parabol(v_frame / 1000, !drawingPadController.isDrawable);
  stone.draw("image");
  blue_bird.animate_bird(v_frame / 8);
  green_bird.animate_bird(v_frame / 6);

  if (blue_bird.is_dead && green_bird.is_dead) {
    win(); // Llamar a la función win en lugar de recargar
  } else if (stone.isStopped) {
    lose(); // Llamar a la función lose en lugar de recargar
  } else {
    window.requestAnimationFrame(step);
  }
}

// Funciones que despliegan el menú de reset. Funcionan, pero no dentro de step.

const gameOverDisplay = document.getElementById("game-over-shade");
const gameOverWinMsg = document.getElementById("game-over-win-msg");
const gameOverLoseMsg = document.getElementById("game-over-lose-msg");
const gameOverReloadBotton = document.getElementById("reload-img-container");

const win = () => {
  gameOverDisplay.classList.remove("hidden");
  gameOverDisplay.classList.add("show");

  gameOverLoseMsg.classList.remove("show");
  gameOverLoseMsg.classList.add("hidden");

  gameOverWinMsg.classList.remove("hidden");
  gameOverWinMsg.classList.add("show");

  console.log("Ganaste");
};

function lose() {
  gameOverDisplay.classList.remove("hidden");
  gameOverDisplay.classList.add("show");

  gameOverLoseMsg.classList.remove("hidden");
  gameOverLoseMsg.classList.add("show");

  gameOverWinMsg.classList.remove("show");
  gameOverWinMsg.classList.add("hidden");
  console.log("Perdiste");
}

// Modificar el botón de reload para que funcione
gameOverReloadBotton.addEventListener("click", function () {
  location.reload();
});

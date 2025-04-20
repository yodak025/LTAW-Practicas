import {
  StaticEntity,
  RockEntity,
  BirdEntity,
  BreakableEntity,
} from "./entities.js";
import {
  EntityView,
  StaticSpriteEntityView,
  AnimatedEntityView,
} from "./entityViews.js";
import { DrawingPad } from "./drawingPad.js";

export async function initSinglePlayerMode() {
  const canvas = document.getElementById("canvas");
  const drawingPadCanvas = document.getElementById("drawing-pad");
  const ctx = canvas.getContext("2d");

  // Función para cargar imágenes
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  // Array para almacenar todos los objetos del juego
  const gameObjects = [];

  // Cargar sprites
  const blueBirdSprites = await Promise.all([
    loadImage("Images/BlueBird/0.png"),
    loadImage("Images/BlueBird/1.png"),
    loadImage("Images/BlueBird/2.png"),
    loadImage("Images/BlueBird/3.png"),
    loadImage("Images/BlueBird/4.png"),
    loadImage("Images/BlueBird/5.png"),
  ]);

  const greenBirdSprites = await Promise.all([
    loadImage("Images/GreenBird/0.png"),
    loadImage("Images/GreenBird/1.png"),
    loadImage("Images/GreenBird/2.png"),
    loadImage("Images/GreenBird/3.png"),
    loadImage("Images/GreenBird/4.png"),
    loadImage("Images/GreenBird/5.png"),
  ]);

  const rockSprite = await loadImage("Images/TheRock.png");

  // Crear entidades
  const rockEntity = new RockEntity(100, 100, 100, 100);
  const blueBirdEntity = new BreakableEntity(300, 100, 100, 100);
  const greenBirdEntity = new BreakableEntity(500, 100, 100, 100);

  // Crear plataforma estática en el medio
  const middlePlatform = new StaticEntity(
    window.innerWidth / 2 - 200, // x centrada
    window.innerHeight / 2, // y en medio
    400, // ancho
    20 // alto
  );

  // Crear vistas
  const rockView = new StaticSpriteEntityView(rockEntity, rockSprite);
  const blueBirdView = new AnimatedEntityView(blueBirdEntity, blueBirdSprites);
  const greenBirdView = new AnimatedEntityView(
    greenBirdEntity,
    greenBirdSprites
  );
  const platformView = new EntityView(middlePlatform);

  // Añadir objetos al juego
  gameObjects.push(rockEntity, blueBirdEntity, greenBirdEntity, middlePlatform);

  // Inicializar el DrawingPad
  const drawingPad = new DrawingPad(drawingPadCanvas, rockEntity);

  // Variables para controlar la animación
  let frameCount = 0;
  const ANIMATION_SPEED = 5; // Cambiar sprite cada 5 frames

  let lastTime = 0;
  const MAX_DELTA = 1 / 30; // Cap at 30 FPS

  function gameLoop(currentTime) {
    const deltaTime = Math.min((currentTime - lastTime) / 1000, MAX_DELTA);
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filtrar las entidades marcadas para eliminación
    const remainingObjects = gameObjects.filter(
      (obj) => !(obj instanceof BirdEntity && obj.markedForDeletion)
    );

    if (remainingObjects.length !== gameObjects.length) {
      gameObjects.length = 0;
      gameObjects.push(...remainingObjects);
    }

    // Actualizar todos los objetos con deltaTime
    for (const obj of gameObjects) {
      obj.update(gameObjects, deltaTime);
    }

    // Función para obtener el color del colider basado en la vida
    function getColliderColor(health) {
      const normalizedHealth = health / 100;
      const red = Math.floor(255 * (1 - normalizedHealth));
      const green = Math.floor(255 * normalizedHealth);
      return `rgba(${red}, ${green}, 0, 0.3)`;
    }

    // Dibujar objetos con sus vistas correspondientes
    rockView.drawSprite();
    rockView.drawCollider("rgba(100, 100, 100, 0.3)");

    // Dibujar la plataforma estática usando su vista
    platformView.drawCollider("rgba(128, 128, 128, 1)");

    if (!blueBirdEntity.markedForDeletion) {
      blueBirdView.drawSprite();
      blueBirdView.drawCollider(getColliderColor(blueBirdEntity.health));
    }
    if (!greenBirdEntity.markedForDeletion) {
      greenBirdView.drawSprite();
      greenBirdView.drawCollider(getColliderColor(greenBirdEntity.health));
    }

    // Actualizar animaciones cada ciertos frames
    frameCount++;
    if (frameCount % ANIMATION_SPEED === 0) {
      blueBirdView.nextFrame();
      greenBirdView.nextFrame();
    }

    requestAnimationFrame(gameLoop);
  }

  // Ajustar el tamaño del canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Configuración inicial
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Iniciar el bucle del juego con timestamp inicial
  requestAnimationFrame((time) => {
    lastTime = time;
    gameLoop(time);
  });
}
initSinglePlayerMode().catch(console.error);

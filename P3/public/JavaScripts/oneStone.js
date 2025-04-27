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
import {
  ANIMATION,
  UI,
  LEVEL,
  RESOURCES,
  ENTITY,
  NETWORK,
  NORMALIZED_SPACE,
  CANVAS
} from "./constants.js";

export async function initStoneGame(socket) {
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
  const blueBirdSprites = await Promise.all(
    Array.from({ length: RESOURCES.IMAGES.BLUE_BIRD_FRAMES }, (_, i) =>
      loadImage(`${RESOURCES.IMAGES.BLUE_BIRD_PREFIX}${i}.png`)
    )
  );

  const greenBirdSprites = await Promise.all(
    Array.from({ length: RESOURCES.IMAGES.GREEN_BIRD_FRAMES }, (_, i) =>
      loadImage(`${RESOURCES.IMAGES.GREEN_BIRD_PREFIX}${i}.png`)
    )
  );

  const rockSprite = await loadImage(RESOURCES.IMAGES.ROCK_PATH);

  // Crear entidades con tamaños y posiciones normalizadas
  const entitySize = ENTITY.DEFAULT_SIZE;
  
  const rockEntity = new RockEntity(
    2, // Posición x normalizada
    2, // Posición y normalizada
    entitySize, // Ancho normalizado
    entitySize  // Alto normalizado
  );
  
  const blueBirdEntity = new BirdEntity(
    6, // Posición x normalizada
    2, // Posición y normalizada
    entitySize, // Ancho normalizado
    entitySize  // Alto normalizado
  );
  
  const greenBirdEntity = new BreakableEntity(
    10, // Posición x normalizada
    2, // Posición y normalizada
    entitySize, // Ancho normalizado
    entitySize  // Alto normalizado
  );

  // Crear plataforma estática en el medio
  const platformWidth = 4; // Ancho normalizado
  const platformHeight = 0.2; // Alto normalizado
  
  const middlePlatform = new StaticEntity(
    (NORMALIZED_SPACE.WIDTH / 2) - (platformWidth / 2), // x centrada
    NORMALIZED_SPACE.HEIGHT / 2,                       // y en medio
    platformWidth,                                      // ancho
    platformHeight                                      // alto
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

  // Inicializar el DrawingPad con la roca
  const drawingPad = new DrawingPad(drawingPadCanvas, canvas, rockEntity);

  // Variables para controlar la animación
  let frameCount = 0;

  // Variables para trackear cambios en la posición
  let lastRockUpdate = {
    x: rockEntity.x,
    y: rockEntity.y,
    velocityX: rockEntity.velocityX || 0,
    velocityY: rockEntity.velocityY || 0,
  };

  function hasPositionChanged(current, last) {
    return (
      Math.abs(current.x - last.x) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.y - last.y) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityX - last.velocityX) >
        NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityY - last.velocityY) > NETWORK.POSITION_THRESHOLD
    );
  }

  // Configurar eventos de socket.io
  socket.on("updateBlueBird", (position) => {
    blueBirdEntity.x = position.x;
    blueBirdEntity.y = position.y;
    blueBirdEntity.velocityX = position.velocityX;
    blueBirdEntity.velocityY = position.velocityY;
  });

  let lastTime = 0;

  function gameLoop(currentTime) {
    const deltaTime = Math.min(
      (currentTime - lastTime) / 1000,
      ANIMATION.MAX_DELTA_TIME
    );
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

    // Enviar la posición de la roca al otro jugador solo si ha cambiado
    const currentRockState = {
      x: rockEntity.x,
      y: rockEntity.y,
      velocityX: rockEntity.velocityX,
      velocityY: rockEntity.velocityY,
    };

    if (hasPositionChanged(currentRockState, lastRockUpdate)) {
      socket.emit("rockUpdate", currentRockState);
      lastRockUpdate = { ...currentRockState };
    }

    // Función para obtener el color del colider basado en la vida
    function getColliderColor(health) {
      const normalizedHealth = health / ENTITY.BIRD.DEFAULT_HEALTH;
      const red = Math.floor(
        UI.COLLIDER_COLORS.HEALTH_BASE_RED * (1 - normalizedHealth)
      );
      const green = Math.floor(
        UI.COLLIDER_COLORS.HEALTH_BASE_GREEN * normalizedHealth
      );
      return `rgba(${red}, ${green}, 0, ${UI.COLLIDER_COLORS.HEALTH_ALPHA})`;
    }

    // Dibujar objetos con sus vistas correspondientes
    rockView.drawSprite();
    rockView.drawCollider(UI.COLLIDER_COLORS.DEFAULT);

    // Dibujar la plataforma estática usando su vista
    platformView.drawCollider(UI.COLLIDER_COLORS.PLATFORM);

    if (!blueBirdEntity.markedForDeletion) {
      blueBirdView.drawSprite();
      blueBirdView.drawHealthBar();
    }
    if (!greenBirdEntity.markedForDeletion) {
      greenBirdView.drawSprite();
      greenBirdView.drawHealthBar();
    }

    // Actualizar animaciones cada ciertos frames
    frameCount++;
    if (frameCount % ANIMATION.SPRITE_FRAME_SPEED === 0) {
      blueBirdView.nextFrame();
      greenBirdView.nextFrame();
    }

    requestAnimationFrame(gameLoop);
  }

  // Resizing ya se maneja en main.js

  // Iniciar el bucle del juego con timestamp inicial
  requestAnimationFrame((time) => {
    lastTime = time;
    gameLoop(time);
  });
}

/**
 * @fileoverview Implementación del modo de juego donde un jugador controla la piedra
 */
import { GameController } from "./core/gameController.js";
import { ENTITY, RESOURCES } from "./constants.js";

/**
 * @function initStoneGame
 * @description Inicializa el juego en modo piedra para multijugador
 * @async
 * @param {Object} socket - Socket para comunicación en tiempo real
 * @param {number} [audioVolume=50] - Volumen del audio (0-100)
 * @returns {Promise<GameController>} Controlador del juego inicializado
 */
export async function initStoneGame(socket, audioVolume = 50) {
  // Obtener referencia al controlador de UI
  const uiController = window.gameUIController;

  const gameController = new GameController({
    gameMode: "stoneplayer",
    socket: socket,
    playerType: "stone",
    controlType: 'mobile', // Forzar tipo de control como mobile para mostrar drawing pad
    forcePadDisplay: true,  // Forzar que se muestre el drawing pad en cualquier caso
    uiController: uiController, // Pasar el controlador de UI
    volume: audioVolume
  });

  // Iniciar la programación de generación de berries
  gameController.entityManager.scheduleNextBerrySpawn();

  // Configurar la función que se encargará de generar las berries
  gameController.setExternalBerrySpawnHandler(
    (entityManager, renderManager, deltaTime) => {
      handleBerryGeneration(entityManager, renderManager, socket, deltaTime);
    }
  );

  await gameController.init();
  return gameController;
}

/**
 * @function handleBerryGeneration
 * @description Maneja la generación periódica de berries y su sincronización en red
 * @param {EntityManager} entityManager - Gestor de entidades del juego
 * @param {RenderManager} renderManager - Gestor de renderizado del juego
 * @param {Object} socket - Socket para comunicación en tiempo real
 * @param {number} deltaTime - Tiempo transcurrido desde la última actualización
 */
function handleBerryGeneration(
  entityManager,
  renderManager,
  socket,
  deltaTime
) {
  // Verificar si es tiempo de generar una berry
  if (entityManager.berrySpawnElapsedTime >= entityManager.nextBerrySpawnTime) {
    // Generar un ID único para la berry
    const berryId =
      "berry_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    // Comprobar límites de berries para decidir en qué árbol colocarla
    const leftTreeCount = entityManager.leftTreeBerryCount;
    const rightTreeCount = entityManager.rightTreeBerryCount;
    const maxPerTree = ENTITY.BERRY.GENERATION.MAX_PER_TREE;
    const totalBerries = entityManager.berries.length;
    const maxTotal = ENTITY.BERRY.GENERATION.MAX_TOTAL;
    
    // No generar si ya alcanzamos el máximo total
    if (totalBerries >= maxTotal) {
      // Programar la siguiente generación y salir
      entityManager.scheduleNextBerrySpawn();
      return;
    }
    
    // Determinar qué árbol usar basado en límites
    let treePosition;
    
    if (leftTreeCount >= maxPerTree && rightTreeCount >= maxPerTree) {
      // Ambos árboles llenos, no generar berry
      entityManager.scheduleNextBerrySpawn();
      return;
    } else if (leftTreeCount >= maxPerTree) {
      // Árbol izquierdo lleno, usar el derecho
      treePosition = "right";
    } else if (rightTreeCount >= maxPerTree) {
      // Árbol derecho lleno, usar el izquierdo
      treePosition = "left";
    } else {
      // Ninguno está lleno, elegir aleatoriamente
      treePosition = Math.random() < 0.5 ? "left" : "right";
    }

    // Generar la posición específica para la berry
    const tree =
      treePosition === "left"
        ? entityManager.leftTreeEntity
        : entityManager.rightTreeEntity;

    // Calcular la región circular en la mitad superior del árbol para la posición
    const treeWidth = tree.width;
    const treeHeight = tree.height;
    const centerX = tree.x + treeWidth / 2;
    const centerY = tree.y + treeHeight / 4;

    // Radio de la región circular (70% del ancho del árbol)
    const radius =
      (treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR) / 2;

    // Generar posición aleatoria dentro del círculo
    const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
    const distance = Math.sqrt(Math.random()) * radius; // Distancia aleatoria desde el centro

    // Calcular posición final
    const berryX = centerX + distance * Math.cos(angle);
    const berryY = centerY + distance * Math.sin(angle);

    // Verificar si la posición es válida
    if (!entityManager.isValidBerryPosition(berryX, berryY)) {
      // Si la posición no es válida, programar siguiente intento y salir
      entityManager.scheduleNextBerrySpawn();
      return;
    }

    // Generar índice de sprite aleatorio
    const spriteIndex = Math.floor(
      Math.random() * RESOURCES.SPRITES.BERRIES_COUNT
    );

    // Generar la berry localmente
    const berry = entityManager.spawnBerry(
      berryId,
      treePosition,
      { x: berryX, y: berryY },
      spriteIndex
    );

    if (berry) {
      // Crear la vista para la berry
      renderManager.createBerryView(berry);

      // Notificar al jugador pájaro para que también genere la berry con los mismos datos
      socket.emit("berrySpawned", {
        id: berryId,
        treePosition: treePosition,
        x: berryX,
        y: berryY,
        spriteIndex: spriteIndex,
      });
    }

    // Programar la siguiente generación de berry
    entityManager.scheduleNextBerrySpawn();
  }
}

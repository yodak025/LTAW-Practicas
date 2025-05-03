// Implementación del modo jugador de piedra
import { GameController } from "./core/gameController.js";
import { ENTITY } from "./constants.js";

// Función para inicializar el modo piedra
export async function initStoneGame(socket) {
  const gameController = new GameController({
    gameMode: 'stoneplayer',
    socket: socket,
    playerType: 'stone'
  });

  // Iniciar la programación de generación de berries
  gameController.entityManager.scheduleNextBerrySpawn();
  
  // Configurar la función que se encargará de generar las berries
  gameController.setExternalBerrySpawnHandler((entityManager, renderManager, deltaTime) => {
    handleBerryGeneration(entityManager, renderManager, socket, deltaTime);
  });
  
  return gameController.init();
}

// Función para manejar la generación de berries
function handleBerryGeneration(entityManager, renderManager, socket, deltaTime) {
  // Verificar si es tiempo de generar una berry
  if (entityManager.berrySpawnElapsedTime >= entityManager.nextBerrySpawnTime) {
    // Generar un ID único para la berry
    const berryId = 'berry_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    // Elegir aleatoriamente un árbol (izquierdo o derecho)
    const treePosition = Math.random() < 0.5 ? "left" : "right";
    
    // Generar la posición específica para la berry
    const tree = treePosition === "left" ? entityManager.leftTreeEntity : entityManager.rightTreeEntity;
    
    // Calcular la región circular en la mitad superior del árbol para la posición
    const treeWidth = tree.width;
    const treeHeight = tree.height;
    const centerX = tree.x + treeWidth / 2;
    const centerY = tree.y + treeHeight / 4;
    
    // Radio de la región circular (70% del ancho del árbol)
    const radius = (treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR) / 2;
    
    // Generar posición aleatoria dentro del círculo
    const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
    const distance = Math.sqrt(Math.random()) * radius; // Distancia aleatoria desde el centro
    
    // Calcular posición final
    const berryX = centerX + distance * Math.cos(angle);
    const berryY = centerY + distance * Math.sin(angle);
    
    // Generar índice de sprite aleatorio
    const spriteIndex = Math.floor(Math.random() * (ENTITY.BERRY.SPRITE_COUNT || 5));
    
    // Generar la berry localmente
    const berry = entityManager.spawnBerry(berryId, treePosition, { x: berryX, y: berryY }, spriteIndex);
    
    if (berry) {
      // Crear la vista para la berry
      renderManager.createBerryView(berry);
      
      // Notificar al jugador pájaro para que también genere la berry con los mismos datos
      socket.emit("berrySpawned", {
        id: berryId,
        treePosition: treePosition,
        position: { x: berryX, y: berryY },
        spriteIndex: spriteIndex
      });
    }
    
    // Programar la siguiente generación de berry
    entityManager.scheduleNextBerrySpawn();
  }
}

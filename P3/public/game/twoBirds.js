// Implementación del modo jugador de pájaros
import { GameController } from "./core/gameController.js";

// Función para inicializar el modo pájaros
export async function initBirdsGame(socket) {
  const gameController = new GameController({
    gameMode: 'birdplayer',
    socket: socket,
    playerType: 'bird'
  });
  
  return gameController.init();
}

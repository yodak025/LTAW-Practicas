// Implementación del modo jugador de pájaros
import { ParabolicParabolaGameControler } from "./game.js";

// Función para inicializar el modo pájaros
export async function initBirdsGame(socket) {
  const gameController = new ParabolicParabolaGameControler({
    gameMode: 'birdplayer',
    socket: socket,
    playerType: 'bird'
  });
  
  return gameController.init();
}

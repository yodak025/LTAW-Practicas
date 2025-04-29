// Implementación del modo jugador de piedra
import { ParabolicParabolaGameControler } from "./game.js";

// Función para inicializar el modo piedra
export async function initStoneGame(socket) {
  const gameController = new ParabolicParabolaGameControler({
    gameMode: 'stoneplayer',
    socket: socket,
    playerType: 'stone'
  });
  
  return gameController.init();
}

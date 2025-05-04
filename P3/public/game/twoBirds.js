// Implementación del modo jugador de pájaros
import { GameController } from "./core/gameController.js";
import { detectMobileDevice } from "./utils/deviceDetector.js";

// Función para inicializar el modo pájaros
export async function initBirdsGame(socket) {
  const isMobile = detectMobileDevice();
  
  const gameController = new GameController({
    gameMode: 'birdplayer',
    socket: socket,
    playerType: 'bird',
    controlType: isMobile ? 'mobile' : 'keyboard',
    dualBirdControl: true,
    forcePadDisplay: false // No forzar el drawing pad en modo birds
  });
  
  return gameController.init();
}

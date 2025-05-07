// Implementación del modo jugador de pájaro
import { GameController } from "./core/gameController.js";
import { detectMobileDevice } from "./utils/deviceDetector.js";

// Función para inicializar el modo pájaro
export async function initBirdsGame(socket, audioVolume = 50) {
  // Obtener referencia al controlador de UI
  const uiController = window.gameUIController;
  
  const isMobile = detectMobileDevice();
  
  const gameController = new GameController({
    gameMode: 'birdplayer',
    socket: socket,
    playerType: 'bird',
    controlType: isMobile ? 'mobile' : 'keyboard',
    dualBirdControl: true,
    forcePadDisplay: false, // No forzar el drawing pad en modo birds
    uiController: uiController, // Pasar el controlador de UI
    volume: audioVolume
  });
  
  // Inicializar el juego
  await gameController.init();
  
  return gameController;
}

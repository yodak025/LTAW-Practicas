/**
 * @fileoverview Implementación del modo de juego donde un jugador controla los dos pájaros
 */
import { GameController } from "./core/gameController.js";
import { detectMobileDevice } from "./utils/deviceDetector.js";

/**
 * @function initBirdsGame
 * @description Inicializa el juego en modo pájaros para multijugador
 * @async
 * @param {Object} socket - Socket para comunicación en tiempo real
 * @param {number} [audioVolume=50] - Volumen del audio (0-100)
 * @returns {Promise<GameController>} Controlador del juego inicializado
 */
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

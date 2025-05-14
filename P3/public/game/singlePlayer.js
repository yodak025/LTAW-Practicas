/**
 * @fileoverview Inicialización del modo de juego para un solo jugador
 */
import { GameController } from './core/gameController.js';

/**
 * @function initSinglePlayerMode
 * @description Inicializa el juego en modo de un solo jugador
 * @async
 * @param {number} [audioVolume=50] - Volumen del audio (0-100)
 * @returns {Promise<GameController>} Controlador del juego inicializado
 */
export async function initSinglePlayerMode(audioVolume = 50) {
  // Crear un controlador de juego con configuración para un solo jugador
  const uiController = window.gameUIController;
  
  const gameController = new GameController({
    gameMode: 'singleplayer',
    playerType: 'stone',
    controlType: 'mobile', 
    forcePadDisplay: true,
    playerType: null,
    uiController: uiController,
    volume: audioVolume
  });
  
  // Initialize the game
  await gameController.init();
  
  return gameController;
}


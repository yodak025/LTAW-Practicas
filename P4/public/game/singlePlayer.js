import { GameController } from './core/gameController.js';

// Initialize single player game mode
export async function initSinglePlayerMode(audioVolume = 50) {
  // Create a game controller with single player settings
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


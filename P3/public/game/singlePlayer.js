// Implementación del modo un jugador
import { GameController } from "./core/gameController.js";

// Función para inicializar el modo un jugador
export async function initSinglePlayerMode() {
  const gameController = new GameController({
    gameMode: 'singleplayer',
    playerType: 'stone',
    controlType: 'mobile', 
    forcePadDisplay: true 
  });
  
  return gameController.init();
}

// Iniciar el juego al cargar el módulo
initSinglePlayerMode().catch(console.error);

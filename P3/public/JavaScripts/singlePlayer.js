// Implementación del modo un jugador
import { ParabolicParabolaGameControler } from "./game.js";

// Función para inicializar el modo un jugador
export async function initSinglePlayerMode() {
  const gameController = new ParabolicParabolaGameControler({
    gameMode: 'singleplayer'
  });
  
  return gameController.init();
}

// Iniciar el juego al cargar el módulo
initSinglePlayerMode().catch(console.error);

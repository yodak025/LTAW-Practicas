// Import UI Controller
import { UIController } from "./ui/UIController.js";

// Import constants
import { NORMALIZED_SPACE, CANVAS, DOM, MESSAGES } from "./constants.js";

// Elementos DOM
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("canvas");
const drawingPadCanvas = document.getElementById("drawing-pad");

// Inicializar Socket.IO
const socket = io();

// Función para redimensionar el canvas con relación de aspecto 16:9
export function resizeCanvas() {
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  // Calcular el margen basado en el porcentaje definido en las constantes
  const marginPercentage = CANVAS.MARGIN_PERCENT / 100;
  const horizontalMargin = containerWidth * marginPercentage;
  const verticalMargin = containerHeight * marginPercentage;

  // Espacio disponible después de aplicar márgenes
  // Añadir margen adicional para asegurar que los bordes sean visibles
  const safetyMargin = Math.max(horizontalMargin, verticalMargin) * 0.5; // Margen de seguridad adicional

  const availableWidth = containerWidth - horizontalMargin * 2 - safetyMargin;
  const availableHeight = containerHeight - verticalMargin * 2 - safetyMargin;

  // Calcular dimensiones manteniendo estrictamente relación de aspecto 16:9
  let canvasWidth, canvasHeight;

  // Determinar la dimensión limitante (altura o anchura) para preservar la relación de aspecto
  if (availableWidth / availableHeight > NORMALIZED_SPACE.ASPECT_RATIO) {
    // La pantalla es más ancha que 16:9, limitar por altura
    canvasHeight = availableHeight;
    canvasWidth = canvasHeight * NORMALIZED_SPACE.ASPECT_RATIO;
  } else {
    // La pantalla es más alta que 16:9, limitar por anchura
    canvasWidth = availableWidth;
    canvasHeight = canvasWidth / NORMALIZED_SPACE.ASPECT_RATIO;
  }

  // Comprobación de seguridad para pantallas muy pequeñas
  const minVisibleWidth = CANVAS.MIN_VISIBLE_WIDTH;
  const minVisibleHeight = minVisibleWidth / NORMALIZED_SPACE.ASPECT_RATIO;

  if (canvasWidth < minVisibleWidth || canvasHeight < minVisibleHeight) {
    if (availableWidth < availableHeight * NORMALIZED_SPACE.ASPECT_RATIO) {
      canvasWidth = Math.min(minVisibleWidth, availableWidth);
      canvasHeight = canvasWidth / NORMALIZED_SPACE.ASPECT_RATIO;
    } else {
      canvasHeight = Math.min(minVisibleHeight, availableHeight);
      canvasWidth = canvasHeight * NORMALIZED_SPACE.ASPECT_RATIO;
    }
  }

  // Aplicar dimensiones al canvas de juego y al contenedor
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  gameContainer.style.width = `${canvasWidth}px`;
  gameContainer.style.height = `${canvasHeight}px`;
  
  // Aplicar el padding dinámico para asegurar visibilidad completa
  gameContainer.style.padding = `${safetyMargin / 4}px`;

  // Forzar una actualización del drawing pad después de cambiar el tamaño del canvas
  const drawingPads = document.querySelectorAll('[id^="drawing-pad"]');
  drawingPads.forEach((pad) => {
    if (pad.resize) pad.resize();
  });
}

// Create and initialize our UI Controller
  const uiController = new UIController(socket);
  
  // Initialize the UI when the document is ready
  window.addEventListener("load", () => {  
  // Initialize UI
  uiController.init();
  window.gameUIController = uiController; // Make it globally accessible

  // Initialize the canvas with background color
  document.body.style.backgroundColor = CANVAS.BACKGROUND_COLOR; //! Esto es estático
  
  // Register resize event for canvas
  window.addEventListener("resize", resizeCanvas);
  
  // Trigger initial resize
  setTimeout(resizeCanvas, 100);
});

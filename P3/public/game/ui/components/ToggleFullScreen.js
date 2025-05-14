/**
 * @fileoverview Componente para alternar el modo de pantalla completa
 */
import { Component } from './Component.js';

/**
 * @class ToggleFullScreen
 * @extends Component
 * @description Componente que crea un botón para alternar el modo de pantalla completa
 */
export class ToggleFullScreen extends Component {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.isFullScreen = false;
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM del botón de pantalla completa
   * @returns {HTMLElement} Botón de pantalla completa
   */
  createElement() {
    const fullscreenButton = document.createElement("button");
    fullscreenButton.className = "ui-button fullscreen-button";
    fullscreenButton.textContent = "Pantalla Completa";
    
    // Añadir event listener para alternar pantalla completa
    fullscreenButton.addEventListener("click", () => {
      this.toggleFullscreen(fullscreenButton);
    });
    
    return fullscreenButton;
  }
  /**
   * @method toggleFullscreen
   * @description Alterna entre el modo de pantalla completa y normal
   * @param {HTMLElement} button - El botón que activó la función para actualizar su texto
   */
  toggleFullscreen(button) {
    if (!document.fullscreenElement) {
      // Entrar en modo pantalla completa
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari y Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
      button.textContent = "Salir de Pantalla Completa";
      this.isFullScreen = true;
    } else {
      // Salir del modo pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari y Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      button.textContent = "Pantalla Completa";
      this.isFullScreen = false;
    }
    
    // Trigger resize event after changing fullscreen state
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
    /**
   * @method update
   * @description Actualiza el estado cuando el estado de pantalla completa cambia externamente
   */
  update() {
    if (this.element) {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      if (isCurrentlyFullScreen !== this.isFullScreen) {
        this.isFullScreen = isCurrentlyFullScreen;
        this.element.textContent = isCurrentlyFullScreen ? 
          "Salir de Pantalla Completa" : "Pantalla Completa";
      }
    }
  }
}
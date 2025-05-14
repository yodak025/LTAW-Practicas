/**
 * @fileoverview Componente para el botón de ajustes
 */
import { Component } from './Component.js';

/**
 * @class Settings
 * @extends Component
 * @description Componente que crea un botón de ajustes en la esquina superior derecha
 */
export class Settings extends Component {
  /**
   * @constructor
   * @param {Function} callback - Función a ejecutar cuando se hace clic en el botón
   */
  constructor(callback) {
    super();
    this.callback = callback;
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM del botón de ajustes
   * @returns {HTMLElement} Botón de ajustes
   */
  createElement() {
    const settingsButton = document.createElement("button");
    settingsButton.className = "ui-button settings-button";
    settingsButton.innerHTML = "⚙️"; // Emoji de engranaje
    settingsButton.addEventListener("click", this.callback);
    return settingsButton;
  }
  /**
   * @method update
   * @description Actualiza la función callback del botón
   * @param {Function} callback - Nueva función callback
   */
  update(callback) {
    if (callback) {
      this.callback = callback;
      if (this.element) {
        // Eliminar el antiguo event listener y añadir uno nuevo
        const newElement = this.createElement();
        if (this.element.parentNode) {
          this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
      }
    }
  }
}
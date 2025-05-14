/**
 * @fileoverview Componente para el botón de retroceso
 */
import { Component } from './Component.js';

/**
 * @class ArrowBack
 * @extends Component
 * @description Componente que muestra un botón de retroceso en la esquina superior izquierda
 */
export class ArrowBack extends Component {
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
   * @description Crea el elemento DOM del botón de retroceso
   * @returns {HTMLElement} Botón de retroceso
   */
  createElement() {
    const arrowBackButton = document.createElement("button");
    arrowBackButton.className = "ui-button arrow-back";
    arrowBackButton.innerHTML = "&#8592;"; // Símbolo de flecha izquierda
    arrowBackButton.addEventListener("click", this.callback);
    return arrowBackButton;
  }
}
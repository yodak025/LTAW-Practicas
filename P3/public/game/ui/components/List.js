
/**
 * @fileoverview Componente para crear listas de opciones clicables
 */
import { Component } from './Component.js';

/**
 * @class List
 * @extends Component
 * @description Componente que crea una lista de elementos clicables a partir de un objeto de opciones
 */
export class List extends Component {
  /**
   * @constructor
   * @param {Object} options - Objeto con pares clave-valor donde cada clave es el texto a mostrar y el valor es la función callback
   * @param {string} customClass - Clase CSS personalizada para el contenedor
   */
  constructor(options, customClass = '') {
    super();
    this.options = options;
    this.customClass = customClass;
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM de la lista
   * @returns {HTMLElement} Contenedor de la lista con botones
   */
  createElement() {
    const listContainer = document.createElement("div");
    listContainer.className = `list-container ${this.customClass}`;

    // Crear un botón para cada opción en la lista
    Object.entries(this.options).forEach(([text, callback]) => {
      const button = document.createElement("button");
      button.className = "list-item";
      button.textContent = text;
      button.addEventListener("click", callback);
      listContainer.appendChild(button);
    });

    return listContainer;
  }
  /**
   * @method update
   * @description Actualiza las opciones de la lista
   * @param {Object} options - Nuevas opciones para la lista
   */
  update(options) {
    if (options) {
      this.options = options;
      // Limpiar y volver a crear los elementos de la lista
      if (this.element) {
        this.element.innerHTML = '';
        Object.entries(this.options).forEach(([text, callback]) => {
          const button = document.createElement("button");
          button.className = "list-item";
          button.textContent = text;
          button.addEventListener("click", callback);
          this.element.appendChild(button);
        });
      }
    }
  }
}
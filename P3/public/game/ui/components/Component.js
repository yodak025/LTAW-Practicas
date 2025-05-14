/**
 * @fileoverview Clase base para todos los componentes de la interfaz de usuario
 */

/**
 * @class Component
 * @description Clase base abstracta para todos los componentes de UI
 */
export class Component {
  /**
   * @constructor
   */
  constructor() {
    this.element = null;
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM del componente - debe ser implementado por las subclases
   * @throws {Error} Si no se implementa en la subclase
   */
  createElement() {
    throw new Error("createElement method must be implemented by subclass");
  }

  /**
   * @method render
   * @description Renderiza y devuelve el elemento DOM
   * @returns {HTMLElement} El elemento DOM del componente
   */
  render() {
    if (!this.element) {
      this.element = this.createElement();
    }
    return this.element;
  }

  /**
   * @method update
   * @description Actualiza el componente con nuevas propiedades
   * @param {Object} props - Propiedades para actualizar el componente
   */
  update(props) {
    // La implementación por defecto no hace nada
  }

  /**
   * @method remove
   * @description Elimina el elemento del DOM
   */
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
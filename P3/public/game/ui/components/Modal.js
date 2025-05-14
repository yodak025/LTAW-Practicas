/**
 * @fileoverview Componente para ventanas modales
 */
import { Component } from './Component.js';

/**
 * @class Modal
 * @extends Component
 * @description Componente que crea una ventana modal emergente con contenido personalizable
 */
export class Modal extends Component {
  /**
   * @constructor
   * @param {HTMLElement|string} content - Contenido a mostrar en el modal
   * @param {string} id - Identificador único para el modal
   */
  constructor(content, id = 'modal') {
    super();
    this.content = content;
    this.id = id;
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM del modal
   * @returns {HTMLElement} Contenedor del modal
   */
  createElement() {
    // Crear contenedor del modal
    const modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
    modalContainer.id = this.id;
    
    // Crear envoltorio para el contenido del modal
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    
    // Crear botón de cierre
    const closeButton = document.createElement("span");
    closeButton.className = "modal-close";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      this.remove();
    });
    
    // Add close button and content to modal
    modalContent.appendChild(closeButton);
    
    // If content is a DOM element, append it directly
    if (this.content instanceof HTMLElement) {
      modalContent.appendChild(this.content);
    } else {
      // Otherwise, create a container with the content as text
      const contentDiv = document.createElement("div");
      contentDiv.textContent = this.content;
      modalContent.appendChild(contentDiv);
    }
    
    modalContainer.appendChild(modalContent);
    
    // Close modal when clicking outside the content
    modalContainer.addEventListener("click", (event) => {
      if (event.target === modalContainer) {
        this.remove();
      }
    });
    
    return modalContainer;
  }
    /**
   * @method update
   * @description Actualiza el contenido del modal
   * @param {HTMLElement|string} content - Nuevo contenido para el modal
   */
  update(content) {
    if (content) {
      this.content = content;
      
      if (this.element) {
        const modalContent = this.element.querySelector('.modal-content');
        // Eliminar contenido antiguo (mantener el botón de cierre)
        const closeButton = modalContent.querySelector('.modal-close');
        modalContent.innerHTML = '';
        modalContent.appendChild(closeButton);
        
        // Añadir nuevo contenido
        if (this.content instanceof HTMLElement) {
          modalContent.appendChild(this.content);
        } else {
          const contentDiv = document.createElement("div");
          contentDiv.textContent = this.content;
          modalContent.appendChild(contentDiv);
        }
      }
    }
  }
}
// Modal component - creates a modal popup with content
import { Component } from './Component.js';

export class Modal extends Component {
  constructor(content, id = 'modal') {
    super();
    this.content = content;
    this.id = id;
  }

  createElement() {
    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
    modalContainer.id = this.id;
    
    // Create modal content wrapper
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    
    // Create close button
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
  
  update(content) {
    if (content) {
      this.content = content;
      
      if (this.element) {
        const modalContent = this.element.querySelector('.modal-content');
        // Remove old content (keep the close button)
        const closeButton = modalContent.querySelector('.modal-close');
        modalContent.innerHTML = '';
        modalContent.appendChild(closeButton);
        
        // Add new content
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
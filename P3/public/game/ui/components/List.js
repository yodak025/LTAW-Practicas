
// List component - creates a list of clickable items from an object
import { Component } from './Component.js';

export class List extends Component {
  constructor(options, customClass = '') {
    super();
    this.options = options;
    this.customClass = customClass;
  }

  createElement() {
    const listContainer = document.createElement("div");
    listContainer.className = `list-container ${this.customClass}`;

    // Create a button for each option in the list
    Object.entries(this.options).forEach(([text, callback]) => {
      const button = document.createElement("button");
      button.className = "list-item";
      button.textContent = text;
      button.addEventListener("click", callback);
      listContainer.appendChild(button);
    });

    return listContainer;
  }

  update(options) {
    if (options) {
      this.options = options;
      // Clear and re-create the list items
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
// Settings component - creates a settings button in the top right corner
import { Component } from './Component.js';

export class Settings extends Component {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  createElement() {
    const settingsButton = document.createElement("button");
    settingsButton.className = "ui-button settings-button";
    settingsButton.innerHTML = "⚙️"; // Gear emoji
    settingsButton.addEventListener("click", this.callback);
    return settingsButton;
  }

  update(callback) {
    if (callback) {
      this.callback = callback;
      if (this.element) {
        // Remove old event listener and add new one
        const newElement = this.createElement();
        if (this.element.parentNode) {
          this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
      }
    }
  }
}
// Arrow Back component - shows a back button in the top left corner
import { Component } from './Component.js';

export class ArrowBack extends Component {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  createElement() {
    const arrowBackButton = document.createElement("button");
    arrowBackButton.className = "ui-button arrow-back";
    arrowBackButton.innerHTML = "&#8592;"; // Left arrow symbol
    arrowBackButton.addEventListener("click", this.callback);
    return arrowBackButton;
  }
}
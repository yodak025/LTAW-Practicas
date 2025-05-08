// ToggleFullScreen component - creates a button to toggle fullscreen mode
import { Component } from './Component.js';

export class ToggleFullScreen extends Component {
  constructor() {
    super();
    this.isFullScreen = false;
  }

  createElement() {
    const fullscreenButton = document.createElement("button");
    fullscreenButton.className = "ui-button fullscreen-button";
    fullscreenButton.textContent = "Pantalla Completa";
    
    // Add event listener for toggling fullscreen
    fullscreenButton.addEventListener("click", () => {
      this.toggleFullscreen(fullscreenButton);
    });
    
    return fullscreenButton;
  }

  // Function to toggle fullscreen mode
  toggleFullscreen(button) {
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
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
      // Exit fullscreen mode
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
  
  // Update state when the page fullscreen state changes externally
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
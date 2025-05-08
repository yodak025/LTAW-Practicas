// Entry point for the renderer process
import { UIController } from './UIController.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the UI controller
  const uiController = new UIController();
  uiController.init();
  
  console.log('Server UI initialized');
});
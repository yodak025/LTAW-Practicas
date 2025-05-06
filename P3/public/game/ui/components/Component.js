// Base Component class for UI components
export class Component {
  constructor() {
    this.element = null;
  }

  // Create the DOM element - to be implemented by subclasses
  createElement() {
    throw new Error("createElement method must be implemented by subclass");
  }

  // Render method returns the DOM element
  render() {
    if (!this.element) {
      this.element = this.createElement();
    }
    return this.element;
  }

  // Update method to be overridden by subclasses if needed
  update(props) {
    // Default implementation does nothing
  }

  // Method to remove element from DOM
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
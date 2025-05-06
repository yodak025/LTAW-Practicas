// AudioSettingContent - creates an audio volume slider
import { Component } from './Component.js';

export class AudioSettingContent extends Component {
  constructor(callback) {
    super();
    this.callback = callback;
    this.value = 50; // Default volume value
  }

  createElement() {
    const container = document.createElement("div");
    container.className = "audio-setting-container";
    
    // Create label
    const label = document.createElement("label");
    label.textContent = "Volumen:";
    label.htmlFor = "volume-slider";
    container.appendChild(label);
    
    // Create volume display
    const volumeValue = document.createElement("span");
    volumeValue.className = "volume-value";
    volumeValue.textContent = `${this.value}%`;
    
    // Create slider
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.value = this.value;
    slider.className = "volume-slider";
    slider.id = "volume-slider";
    
    // Add event listener
    slider.addEventListener("input", () => {
      this.value = slider.value;
      volumeValue.textContent = `${this.value}%`;
      this.callback(this.value);
    });
    
    // Add elements to container
    container.appendChild(slider);
    container.appendChild(volumeValue);
    
    return container;
  }
  
  update(props) {
    if (props.value !== undefined) {
      this.value = props.value;
      
      if (this.element) {
        const slider = this.element.querySelector('.volume-slider');
        const volumeValue = this.element.querySelector('.volume-value');
        
        if (slider) slider.value = this.value;
        if (volumeValue) volumeValue.textContent = `${this.value}%`;
      }
    }
    
    if (props.callback) {
      this.callback = props.callback;
    }
  }
}
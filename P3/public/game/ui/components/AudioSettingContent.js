/**
 * @fileoverview Componente para control de volumen de audio
 */
import { Component } from './Component.js';

/**
 * @class AudioSettingContent
 * @extends Component
 * @description Componente que crea un control deslizante para ajustar el volumen de audio
 */
export class AudioSettingContent extends Component {
  /**
   * @constructor
   * @param {Function} callback - Función a llamar cuando cambia el valor del volumen
   */
  constructor(callback) {
    super();
    this.callback = callback;
    this.value = 50; // Valor predeterminado de volumen
  }

  /**
   * @method createElement
   * @description Crea el elemento DOM del control de volumen
   * @returns {HTMLElement} Contenedor del control de volumen
   */
  createElement() {
    const container = document.createElement("div");
    container.className = "audio-setting-container";
    
    // Crear etiqueta
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
    /**
   * @method update
   * @description Actualiza el control de volumen con nuevos valores
   * @param {Object} props - Propiedades a actualizar
   * @param {number} [props.value] - Nuevo valor del volumen
   * @param {Function} [props.callback] - Nueva función callback
   */
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
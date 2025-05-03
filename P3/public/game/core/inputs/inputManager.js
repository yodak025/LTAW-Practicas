// Gestor de entrada para manejar los controles del juego
import { DrawingPad } from "./drawingPad.js";
import { DOM } from "../../constants.js";

export class InputManager {
  constructor() {
    // Canvas para el pad de dibujo
    this.drawingPadCanvas = document.getElementById("drawing-pad");
    this.mainCanvas = document.getElementById("canvas");
    
    // Instancia del DrawingPad
    this.drawingPad = null;
    
    // Entidad controlada
    this.controlledEntity = null;
    
    // Callback para lanzar poop
    this.onPoopLaunched = null;
    
    // Estado de las teclas
    this.keyStates = {
      [DOM.CONTROLS.POOP_KEY]: false
    };
    
    // Bindear métodos para contexto
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }
  
  // Inicializar el DrawingPad con la entidad controlada
  init(controlledEntity, speedFactor) {
    this.controlledEntity = controlledEntity;
    
    // Crear el DrawingPad para controlar la entidad
    this.drawingPad = new DrawingPad(
      this.drawingPadCanvas,
      this.mainCanvas,
      this.controlledEntity,
      speedFactor
    );
    
    // Agregar event listeners para las teclas
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    
    // Configurar el callback de lanzamiento de poop
    this.drawingPad.onPoopLaunched = (bird) => {
      if (this.onPoopLaunched) {
        this.onPoopLaunched(bird);
      }
    };
    
    return this;
  }
  
  // Manejador de evento keydown
  _onKeyDown(event) {
    // Guardar el estado de la tecla
    this.keyStates[event.key] = true;
    
    // Si la tecla espacio está presionada y tenemos una entidad controlada
    if (event.key === DOM.CONTROLS.POOP_KEY && this.controlledEntity) {
      // Verificar si la entidad es un pájaro
      if (this.controlledEntity.hasTag && this.controlledEntity.hasTag("bird")) {
        // Si tenemos un callback para lanzar poop, llamarlo
        if (this.onPoopLaunched) {
          this.onPoopLaunched(this.controlledEntity);
        }
      }
    }
  }
  
  // Manejador de evento keyup
  _onKeyUp(event) {
    // Actualizar el estado de la tecla
    this.keyStates[event.key] = false;
  }
  
  // Establecer callback para lanzamiento de poop
  setPoopLaunchHandler(callback) {
    this.onPoopLaunched = callback;
    if (this.drawingPad) {
      this.drawingPad.onPoopLaunched = callback;
    }
    return this;
  }
  
  // Cambiar la entidad controlada
  setControlledEntity(entity, speedFactor) {
    this.controlledEntity = entity;
    
    // Actualizar el DrawingPad con la nueva entidad
    if (this.drawingPad) {
      this.drawingPad.setControlEntity(entity, speedFactor);
    }
    
    return this;
  }
  
  // Limpiar event listeners al terminar
  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    
    // Limpiar el DrawingPad si existe
    if (this.drawingPad) {
      this.drawingPad.dispose && this.drawingPad.dispose();
    }
  }
}
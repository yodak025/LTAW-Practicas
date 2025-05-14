/**
 * @fileoverview Gestor de entrada para manejar los controles del juego
 */
import { DrawingPad } from "./drawingPad.js";
import { DOM } from "../../constants.js";
import { detectMobileDevice } from "../../utils/deviceDetector.js";

/**
 * @class InputManager
 * @description Maneja las entradas de usuario para controlar las entidades del juego
 */
export class InputManager {
  /**
   * @constructor
   * @description Inicializa el gestor de entrada con los elementos de la interfaz
   */
  constructor() {
    // Canvas para el pad de dibujo
    this.drawingPadCanvas = document.getElementById("drawing-pad");
    this.drawingPadRightCanvas = document.getElementById("drawing-pad-right");
    this.mainCanvas = document.getElementById("canvas");
    
    // Instancias de DrawingPad (izquierda y derecha para control dual)
    this.drawingPad = null;
    this.drawingPadRight = null;
    
    // Entidades controladas
    this.controlledEntity = null; // Entidad principal (para compatibilidad)
    this.blueBirdEntity = null;   // Pájaro azul
    this.greenBirdEntity = null;  // Pájaro verde
    
    // Modo de control
    this.controlType = 'keyboard'; // 'keyboard' o 'mobile'
    this.dualBirdControl = false;  // Controlar dos pájaros
    this.forcePadDisplay = false;  // Forzar mostrar pad independientemente del dispositivo
    
    // Callback para lanzar poop
    this.onPoopLaunched = null;
    
    // Estado de las teclas
    this.keyStates = {
      // Teclas WASD para pájaro azul
      'w': false,
      'a': false,
      's': false,
      'd': false,
      // Flechas para pájaro verde
      'ArrowUp': false,
      'ArrowLeft': false,
      'ArrowDown': false,
      'ArrowRight': false,
      // Espacio para poop (ambos)
      [DOM.CONTROLS.POOP_KEY]: false
    };
    
    // Velocidades de movimiento
    this.keyboardMoveSpeed = 5;
    
    // Bindear métodos para contexto
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onCanvasClick = this._onCanvasClick.bind(this);
    this._updateKeyboardControls = this._updateKeyboardControls.bind(this);
    
    // Flag para tracking de animación
    this.animFrameId = null;
    
    // Flag para indicar si estamos en dispositivo móvil
    this.isMobileDevice = detectMobileDevice();
  }
  
  // Inicializar el gestor de entrada con la configuración adecuada
  init(controlledEntity, speedFactor, options = {}) {
    this.controlledEntity = controlledEntity;
    this.controlType = options.controlType || 'keyboard';
    this.dualBirdControl = options.dualBirdControl || false;
    this.blueBirdEntity = options.blueBirdEntity || controlledEntity;
    this.greenBirdEntity = options.greenBirdEntity || controlledEntity;
    this.forcePadDisplay = options.forcePadDisplay || false;
    
    // Determinar el tipo de controles a usar
    if (this.controlType === 'mobile' || this.forcePadDisplay) {
      // Dispositivo móvil o forzar pad de dibujo (oneStone.js)
      this._setupMobileControls(speedFactor);
    } else {
      // Controles de teclado para PC
      this._setupKeyboardControls();
    }
    
    return this;
  }
  
  // Configurar controles para dispositivo móvil
  _setupMobileControls(speedFactor) {
    // Asegurarse de que existan los canvas necesarios
    this._createDrawingPadCanvases();
    
    // Crear DrawingPad izquierdo (pájaro azul)
    if (this.drawingPadCanvas) {
      this.drawingPad = new DrawingPad(
        this.drawingPadCanvas,
        this.mainCanvas,
        this.blueBirdEntity,
        speedFactor,
        { position: 'bottomLeft' }
      );
    }
    
    // Si es control dual, crear DrawingPad derecho (pájaro verde)
    if (this.dualBirdControl && this.drawingPadRightCanvas) {
      this.drawingPadRight = new DrawingPad(
        this.drawingPadRightCanvas,
        this.mainCanvas,
        this.greenBirdEntity,
        speedFactor,
        { position: 'bottomRight' }
      );
    }
    
    // Configurar eventos para hacer poops al tocar el canvas principal
    if (this.dualBirdControl) {
      this.mainCanvas.addEventListener('click', this._onCanvasClick);
      this.mainCanvas.addEventListener('touchend', this._onCanvasClick);
    }
    
    // Eventos de teclado igual para compatibilidad
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    
    // Mostrar u ocultar los drawing pads según el tipo de dispositivo
    this._updateDrawingPadVisibility();
  }
  
  // Configurar controles para teclado (PC)
  _setupKeyboardControls() {
    // Agregar event listeners para las teclas
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    
    // Iniciar bucle de control de teclado
    this.animFrameId = requestAnimationFrame(this._updateKeyboardControls);
    
    // Asegurarse de que los drawing pads estén ocultos en modo desktop
    this._updateDrawingPadVisibility();
  }
  
  // Crear los canvas necesarios para los drawing pads si no existen
  _createDrawingPadCanvases() {
    // Si no existe el canvas del drawing pad izquierdo, crearlo
    if (!this.drawingPadCanvas) {
      this.drawingPadCanvas = document.createElement('canvas');
      this.drawingPadCanvas.id = 'drawing-pad';
      document.body.appendChild(this.drawingPadCanvas);
    }
    
    // Si no existe el canvas del drawing pad derecho y se requiere control dual, crearlo
    if (!this.drawingPadRightCanvas && this.dualBirdControl) {
      this.drawingPadRightCanvas = document.createElement('canvas');
      this.drawingPadRightCanvas.id = 'drawing-pad-right';
      document.body.appendChild(this.drawingPadRightCanvas);
    }
  }
  
  // Actualizar visibilidad de los drawing pads según el dispositivo
  _updateDrawingPadVisibility() {
    // Si los drawing pads existen, mostrar/ocultar según el tipo de dispositivo
    if (this.drawingPadCanvas) {
      if (this.isMobileDevice || this.forcePadDisplay) {
        this.drawingPadCanvas.classList.remove('hidden');
      } else {
        this.drawingPadCanvas.classList.add('hidden');
      }
    }
    
    if (this.drawingPadRightCanvas) {
      if (this.isMobileDevice || this.forcePadDisplay) {
        this.drawingPadRightCanvas.classList.remove('hidden');
      } else {
        this.drawingPadRightCanvas.classList.add('hidden');
      }
    }
  }
  
  // Manejar evento click/touch en el canvas principal para dispositivos móviles
  _onCanvasClick(event) {
    // Evitar propagación si es en un drawing pad
    if (event.target === this.drawingPadCanvas || 
        event.target === this.drawingPadRightCanvas) {
      return;
    }
    
    // En dispositivos móviles, lanzar poop para ambos pájaros si tienen berries
    if (this.dualBirdControl) {
      // Lanzar poop con pájaro azul si tiene berries
      if (this.blueBirdEntity && this.blueBirdEntity.berryCount > 0) {
        if (this.onPoopLaunched) {
          this.onPoopLaunched(this.blueBirdEntity);
        }
      }
      
      // Lanzar poop con pájaro verde si tiene berries
      if (this.greenBirdEntity && this.greenBirdEntity.berryCount > 0) {
        if (this.onPoopLaunched) {
          this.onPoopLaunched(this.greenBirdEntity);
        }
      }
    }
  }
  
  // Bucle para actualizar el movimiento basado en el teclado
  _updateKeyboardControls() {
    if (this.controlType === 'mobile' || this.forcePadDisplay) {
      // Si es móvil o se fuerza el pad, no usar controles de teclado para movimiento
      // aunque aún se pueden usar teclas específicas (como espacio)
      this.animFrameId = requestAnimationFrame(this._updateKeyboardControls);
      return;
    }
    
    // Control del pájaro azul con WASD
    if (this.blueBirdEntity) {
      if (this.keyStates['w']) this.blueBirdEntity.velocityY = -this.keyboardMoveSpeed;
      else if (this.keyStates['s']) this.blueBirdEntity.velocityY = this.keyboardMoveSpeed;
      else if (this.blueBirdEntity.velocityY !== 0) this.blueBirdEntity.velocityY *= 0.9; // Desaceleración
      
      if (this.keyStates['a']) this.blueBirdEntity.velocityX = -this.keyboardMoveSpeed;
      else if (this.keyStates['d']) this.blueBirdEntity.velocityX = this.keyboardMoveSpeed;
      else if (this.blueBirdEntity.velocityX !== 0) this.blueBirdEntity.velocityX *= 0.9; // Desaceleración
    }
    
    // Control del pájaro verde con flechas del teclado
    if (this.dualBirdControl && this.greenBirdEntity) {
      if (this.keyStates['ArrowUp']) this.greenBirdEntity.velocityY = -this.keyboardMoveSpeed;
      else if (this.keyStates['ArrowDown']) this.greenBirdEntity.velocityY = this.keyboardMoveSpeed;
      else if (this.greenBirdEntity.velocityY !== 0) this.greenBirdEntity.velocityY *= 0.9; // Desaceleración
      
      if (this.keyStates['ArrowLeft']) this.greenBirdEntity.velocityX = -this.keyboardMoveSpeed;
      else if (this.keyStates['ArrowRight']) this.greenBirdEntity.velocityX = this.keyboardMoveSpeed;
      else if (this.greenBirdEntity.velocityX !== 0) this.greenBirdEntity.velocityX *= 0.9; // Desaceleración
    }
    
    // Continuar el bucle de animación
    this.animFrameId = requestAnimationFrame(this._updateKeyboardControls);
  }
  
  // Manejador de evento keydown
  _onKeyDown(event) {
    // Si la tecla ya estaba presionada, no hacemos nada
    if (this.keyStates[event.key] === true) {
      return;
    }
    
    // Guardar el estado de la tecla
    this.keyStates[event.key] = true;
    
    // Si la tecla espacio está presionada, lanzar poops según corresponda
    if (event.key === DOM.CONTROLS.POOP_KEY) {
      // En control dual, lanzar con ambos pájaros si tienen berries
      if (this.dualBirdControl) {
        // Pájaro azul
        if (this.blueBirdEntity && this.blueBirdEntity.berryCount > 0) {
          if (this.onPoopLaunched) {
            this.onPoopLaunched(this.blueBirdEntity);
          }
        }
        
        // Pájaro verde
        if (this.greenBirdEntity && this.greenBirdEntity.berryCount > 0) {
          if (this.onPoopLaunched) {
            this.onPoopLaunched(this.greenBirdEntity);
          }
        }
      } 
      // Control simple, solo un pájaro
      else if (this.controlledEntity && this.controlledEntity.berryCount > 0) {
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
    
    // Actualizar en los drawing pads si existen
    if (this.drawingPad) {
      this.drawingPad.onPoopLaunched = (bird) => callback(bird);
    }
    
    if (this.drawingPadRight) {
      this.drawingPadRight.onPoopLaunched = (bird) => callback(bird);
    }
    
    return this;
  }
  
  // Actualizar las entidades controladas
  setControlledEntities(blueBirdEntity, greenBirdEntity, speedFactor) {
    this.blueBirdEntity = blueBirdEntity;
    this.greenBirdEntity = greenBirdEntity;
    
    // Actualizar los DrawingPads si existen
    if (this.drawingPad) {
      this.drawingPad.setControlEntity(blueBirdEntity, speedFactor);
    }
    
    if (this.drawingPadRight) {
      this.drawingPadRight.setControlEntity(greenBirdEntity, speedFactor);
    }
    
    return this;
  }
  
  // Limpiar event listeners al terminar
  dispose() {
    // Detener el bucle de control de teclado
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    
    // Quitar event listeners
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    
    if (this.mainCanvas) {
      this.mainCanvas.removeEventListener('click', this._onCanvasClick);
      this.mainCanvas.removeEventListener('touchend', this._onCanvasClick);
    }
    
    // Limpiar los DrawingPads si existen
    if (this.drawingPad) {
      this.drawingPad.dispose();
    }
    
    if (this.drawingPadRight) {
      this.drawingPadRight.dispose();
    }
  }
}
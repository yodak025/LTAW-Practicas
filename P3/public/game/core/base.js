/**
 * @fileoverview Base para todos los componentes del juego
 */
import { NORMALIZED_SPACE, UI, ENTITY, ANIMATION } from "../constants.js";

/**
 * @class Game
 * @description Clase base para gestores de juego, implementa el patrón Observer
 */
export class Game {
  /**
   * @constructor
   * @description Inicializa la estructura base de un gestor de juego
   */
  constructor() {
    this.observers = [];
    this.gameObjects = [];
    this.state = {
      isRunning: false,
      isPaused: false,
      score: 0,
      frameCount: 0
    };
    this.lastTime = 0;
  }
  /**
   * @method addObserver
   * @description Añade un observador al sistema de eventos
   * @param {Object} observer - Objeto observador con un método notify
   */
  addObserver(observer) {
    if (typeof observer.notify === 'function') {
      this.observers.push(observer);
    }
  }

  /**
   * @method notifyObservers
   * @description Notifica a todos los observadores registrados
   * @param {string} event - Nombre del evento
   * @param {*} data - Datos adicionales para el evento
   */
  notifyObservers(event, data) {
    this.observers.forEach(observer => observer.notify(event, data));
  }

  /**
   * @method init
   * @async
   * @description Método de inicialización que debe implementarse en subclases
   * @throws {Error} Si no se implementa en la subclase
   */
  async init() {
    throw new Error("El método init debe ser implementado por las subclases");
  }
  /**
   * @method startGameLoop
   * @description Inicia el bucle principal del juego
   * @param {number} time - Tiempo inicial en milisegundos
   */
  startGameLoop(time) {
    this.lastTime = time;
    this.state.isRunning = true;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * @method gameLoop
   * @description Bucle principal del juego que gestiona la actualización y renderizado
   * @param {number} currentTime - Tiempo actual en milisegundos
   */
  gameLoop(currentTime) {
    if (!this.state.isRunning) return;
    
    // Calcular delta time con límite máximo
    const deltaTime = Math.min(
      (currentTime - this.lastTime) / 1000, 
      ANIMATION.MAX_DELTA_TIME
    );
    this.lastTime = currentTime;

    // No hacer nada si el juego está en pausa
    if (!this.state.isPaused) {
      // Actualizar objetos
      this.update(deltaTime);
      
      // Dibujar escena
      this.draw();
    }

    // Incrementar contador de frames
    this.state.frameCount++;

    // Continuar el bucle
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  /**
   * @method update
   * @description Actualiza la lógica del juego en cada frame
   * @param {number} deltaTime - Tiempo transcurrido desde el último frame en segundos
   * @throws {Error} Si no se implementa en la subclase
   */
  update(deltaTime) {
    throw new Error("El método update debe ser implementado por las subclases");
  }

  /**
   * @method draw
   * @description Renderiza el estado actual del juego
   * @throws {Error} Si no se implementa en la subclase
   */
  draw() {
    throw new Error("El método draw debe ser implementado por las subclases");
  }

  /**
   * @method togglePause
   * @description Alterna el estado de pausa del juego
   */
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    this.notifyObservers('pauseStateChanged', this.state.isPaused);
  }

  /**
   * @method stop
   * @description Detiene el bucle del juego
   */
  stop() {
    this.state.isRunning = false;
    this.notifyObservers('gameStopped');
  }
}
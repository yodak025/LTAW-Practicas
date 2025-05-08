// Base para todos los componentes del juego
import { NORMALIZED_SPACE, UI, ENTITY, ANIMATION } from "../constants.js";

// Clase base para gestores de juego, implementa el patrón Observer
export class Game {
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

  // Añadir un observador
  addObserver(observer) {
    if (typeof observer.notify === 'function') {
      this.observers.push(observer);
    }
  }

  // Notificar a los observadores
  notifyObservers(event, data) {
    this.observers.forEach(observer => observer.notify(event, data));
  }

  // Inicialización básica
  async init() {
    throw new Error("El método init debe ser implementado por las subclases");
  }

  // Bucle de juego común
  startGameLoop(time) {
    this.lastTime = time;
    this.state.isRunning = true;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Bucle principal genérico
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

  // Métodos abstractos a implementar
  update(deltaTime) {
    throw new Error("El método update debe ser implementado por las subclases");
  }

  draw() {
    throw new Error("El método draw debe ser implementado por las subclases");
  }

  // Pausar/reanudar el juego
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    this.notifyObservers('pauseStateChanged', this.state.isPaused);
  }

  // Detener el juego
  stop() {
    this.state.isRunning = false;
    this.notifyObservers('gameStopped');
  }
}
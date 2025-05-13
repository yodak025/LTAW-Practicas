// Controlador del juego que integra todos los componentes
import { Game } from "./base.js";
import { EntityManager } from "./entities/entityManager.js";
import { RenderManager } from "./rendering/renderManager.js";
import { InputManager } from "./inputs/inputManager.js";
import { NetworkManager } from "./networkManager.js";
import { ANIMATION, ENTITY, RESOURCES, NETWORK } from "../constants.js";
import { detectMobileDevice } from "../utils/deviceDetector.js";
import { DamageableComponent } from "./entities/entities.js";

export class GameController extends Game {
  constructor(options = {}) {
    super();
    
    // Opciones de configuración
    this.gameMode = options.gameMode || "singleplayer";
    this.playerType = options.playerType || null;
    this.controlType = options.controlType || (detectMobileDevice() ? 'mobile' : 'keyboard');
    this.dualBirdControl = options.dualBirdControl || false;
    this.forcePadDisplay = options.forcePadDisplay || false;
    
    // UI Controller para manejar mensajes de victoria/derrota
    this.uiController = options.uiController || null;
    
    // Inicializar componentes del juego
    this.entityManager = new EntityManager();
    this.renderManager = new RenderManager();
    this.inputManager = new InputManager();
    this.networkManager = options.socket ? 
      new NetworkManager(options.socket).configure(this.gameMode, this.playerType) : 
      null;
    
    // Variables de control
    this.entitySize = ENTITY.DEFAULT_SIZE;
    this.gameEnded = false;

    // Sistema de audio
    this.backgroundMusic = new Audio('/assets/BirdsonaWire.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = options.volume !== undefined ? options.volume / 100 : 0.5;

    // Callback para generación externa de berries (para oneStone.js)
    this.onExternalBerrySpawn = null;
  }

  // Inicializa el juego
  async init() {
    // Cargar los recursos visuales
    await this.renderManager.loadSprites();
    
    // Inicializar tamaños visuales
    this.renderManager.initVisualSizes(this.entitySize);
    
    // Crear las entidades del juego
    this.entityManager.createEntities(this.gameMode);
    
    // Crear las vistas para las entidades
    this.renderManager.createViews(this.entityManager);
    
    // Determinar las entidades controladas según el modo de juego
    let controlledEntity, speedFactor;
    
    if (this.gameMode === "birdplayer" && this.dualBirdControl) {
      // Control dual de pájaros
      speedFactor = {
        X: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
        Y: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
      };
      
      // Inicializar el gestor de entrada con ambos pájaros
      this.inputManager.init(null, speedFactor, {
        controlType: this.controlType,
        dualBirdControl: true,
        blueBirdEntity: this.entityManager.blueBirdEntity,
        greenBirdEntity: this.entityManager.greenBirdEntity,
        forcePadDisplay: this.forcePadDisplay
      });
    } else {
      // Control simple (modo clásico)
      controlledEntity = this.entityManager.getControlledEntity(
        this.gameMode, 
        this.playerType
      );
      
      // Determinar el factor de velocidad adecuado según la entidad controlada
      if (controlledEntity.hasTag && controlledEntity.hasTag("stone")) {
        speedFactor = ENTITY.STONE.LAUNCH_SPEED_FACTOR;
      } else if (controlledEntity.hasTag && controlledEntity.hasTag("bird")) {
        speedFactor = {
          X: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
          Y: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
        };
      } else {
        speedFactor = { X: 30, Y: 30 };
      }
      
      // Inicializar el gestor de entrada con una sola entidad
      this.inputManager.init(controlledEntity, speedFactor, {
        controlType: this.controlType,
        forcePadDisplay: this.forcePadDisplay
      });
    }
    
    // Configurar el manejador de lanzamiento de poop
    this.inputManager.setPoopLaunchHandler(this.handlePoopLaunch.bind(this));
    
    // Configurar el gestor de red si estamos en modo multijugador
    if (this.networkManager) {
      this.networkManager.setupHandlers(this.entityManager, this.renderManager);
      // Configurar manejador para evento game-over
      this.setupGameOverHandler();
    } else {
      // En modo un jugador, siempre programar la generación de berries
      this.entityManager.scheduleNextBerrySpawn();
    }
    
    // Iniciar el bucle del juego
    requestAnimationFrame(this.startGameLoop.bind(this));
    
    // Iniciar la reproducción de música de fondo
    this.playBackgroundMusic();

    return this;
  }
  
  // Métodos para controlar la música de fondo
  playBackgroundMusic() {
    this.backgroundMusic.play().catch(err => console.log("Error reproduciendo música:", err));
  }
  
  pauseBackgroundMusic() {
    this.backgroundMusic.pause();
  }
  
  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }
  
  setMusicVolume(volumeLevel) {
    // volumeLevel debe estar entre 0 y 100
    this.backgroundMusic.volume = volumeLevel / 100;
  }

  // Método para configurar el manejador de eventos game-over
  setupGameOverHandler() {
    if (this.networkManager && this.networkManager.socket) {
      this.networkManager.socket.on("game-over", () => {
        // Mostrar pantalla de victoria y detener el juego
        if (this.uiController && !this.gameEnded) {
          this.gameEnded = true;
          this.uiController.showGameResult(true); // true = victoria
          this.stop();
        }
      });
    }
  }
  
  // Método para enviar evento de game-over al oponente
  sendGameOver() {
    if (this.networkManager && this.networkManager.socket) {
      this.networkManager.socket.emit("game-over");
    }
  }
  
  // Método para manejar el lanzamiento de poop cuando se presiona la tecla espacio
  handlePoopLaunch(bird) {
    const poopEntity = this.entityManager.createPoopFromBird(bird);
    
    if (poopEntity) {
      // Si está en modo red, notificar al otro cliente sobre la creación del poop
      if (this.networkManager) {
        // Determinar qué tipo de pájaro lanzó el poop
        const birdType = bird === this.entityManager.blueBirdEntity ? "blue" : "green";
        
        // Notificar al servidor sobre el poop generado
        this.networkManager.socket.emit("poopSpawned", {
          id: poopEntity.id,
          birdType: birdType,
          x: poopEntity.x,
          y: poopEntity.y
        });
        
        // Crear la vista para el pájaro local
        this.renderManager.createPoopView(poopEntity);
      } else {
        // En modo local, simplemente crear la vista
        this.renderManager.createPoopView(poopEntity);
      }
    }
  }

  // Actualización del juego
  update(deltaTime) {
    // No actualizar si el juego ha terminado
    if (this.gameEnded) return;
    
    // Actualizar las entidades del juego
    this.entityManager.updateEntities(deltaTime);
    
    // Actualizar estados en la red si es necesario
    if (this.networkManager) {
      this.networkManager.updateEntityStates(this.entityManager);
    }
    
    // Verificar si es tiempo de generar una berry (solo en modo singleplayer)
    if (!this.networkManager && this.gameMode === "singleplayer") {
      if (this.entityManager.berrySpawnElapsedTime >= this.entityManager.nextBerrySpawnTime) {
        // En modo un jugador, generar localmente
        const treePosition = Math.random() < 0.5 ? "left" : "right";
        const berry = this.entityManager.spawnBerry(null, treePosition);
        if (berry) {
          this.renderManager.createBerryView(berry);
        }
        
        // Programar la siguiente generación
        this.entityManager.scheduleNextBerrySpawn();
      }
    }
    
    // En modo "stoneplayer", también podríamos generar berries y notificarlas a twoBirds
    if (this.gameMode === "stoneplayer" && this.onExternalBerrySpawn) {
      this.onExternalBerrySpawn(this.entityManager, this.renderManager, deltaTime);
    }
    
    // Verificar condiciones de victoria/derrota
    this.checkGameEndConditions();
  }

  // Método para verificar condiciones de fin de juego
  checkGameEndConditions() {
    if (this.gameEnded) return;
    
    // Verificar condiciones según el modo de juego
    if (this.gameMode === "singleplayer") {
      this.checkSinglePlayerEndConditions();
    } else if (this.gameMode === "stoneplayer") {
      this.checkStonePlayerEndConditions();
    } else if (this.gameMode === "birdplayer") {
      this.checkBirdPlayerEndConditions();
    }
  }
  
  // Verificar condiciones de fin para el modo un jugador
  checkSinglePlayerEndConditions() {
    const blueBird = this.entityManager.blueBirdEntity;
    const greenBird = this.entityManager.greenBirdEntity;
    const stone = this.entityManager.stoneEntity;
    
    // Verificar si los pájaros están muertos (victoria)
    const blueBirdDead = blueBird.getComponent(DamageableComponent).health <= 0;
    const greenBirdDead = greenBird.getComponent(DamageableComponent).health <= 0;
    
    if (blueBirdDead && greenBirdDead && this.uiController) {
      this.gameEnded = true;
      this.uiController.showGameResult(true); // Victoria
      this.stop();
      return;
    }
    
    // Verificar si la piedra está muerta (derrota)
    const stoneDead = stone.getComponent(DamageableComponent).health <= 0;
    
    if (stoneDead && this.uiController) {
      this.gameEnded = true;
      this.uiController.showGameResult(false); // Derrota
      this.stop();
      return;
    }
  }
  
  // Verificar condiciones de fin para el modo piedra
  checkStonePlayerEndConditions() {
    const stone = this.entityManager.stoneEntity;
    
    // Verificar si la piedra está muerta (derrota)
    const stoneDead = stone.getComponent(DamageableComponent).health <= 0;
    
    if (stoneDead && this.uiController && !this.gameEnded) {
      this.gameEnded = true;
      this.uiController.showGameResult(false); // Derrota
      // Notificar al oponente de nuestra derrota (su victoria)
      this.sendGameOver();
      this.stop();
    }
  }
  
  // Verificar condiciones de fin para el modo pájaro
  checkBirdPlayerEndConditions() {
    const blueBird = this.entityManager.blueBirdEntity;
    const greenBird = this.entityManager.greenBirdEntity;
    
    // Verificar si ambos pájaros están muertos (derrota)
    const blueBirdDead = blueBird.getComponent(DamageableComponent).health <= 0;
    const greenBirdDead = greenBird.getComponent(DamageableComponent).health <= 0;
    
    if (blueBirdDead && greenBirdDead && this.uiController && !this.gameEnded) {
      this.gameEnded = true;
      this.uiController.showGameResult(false); // Derrota
      // Notificar al oponente de nuestra derrota (su victoria)
      this.sendGameOver();
      this.stop();
    }
  }

  // Método para generar una berry desde fuera (para oneStone)
  spawnBerry(id, treePosition) {
    const berry = this.entityManager.spawnBerry(id, treePosition);
    if (berry) {
      this.renderManager.createBerryView(berry);
      return berry;
    }
    return null;
  }

  // Asignar callback para generación de berries desde oneStone
  setExternalBerrySpawnHandler(callback) {
    this.onExternalBerrySpawn = callback;
    return this;
  }

  // Renderizado del juego
  draw(deltaTime) {
    // Limpiar el canvas
    this.renderManager.clear();
    
    // Dibujar todas las entidades
    this.renderManager.draw(this.entityManager);
    
    // Actualizar las animaciones
    this.renderManager.updateAnimations(deltaTime);
  }

  // Override del método stop para también detener la música
  stop() {
    super.stop();
    this.stopBackgroundMusic();
  }

  // Override del método pause para también pausar la música
  pause() {
    super.pause();
    this.pauseBackgroundMusic();
  }

  // Override del método resume para también reanudar la música
  resume() {
    super.resume();
    this.playBackgroundMusic();
  }
}
// Controlador del juego que integra todos los componentes
import { Game } from "./base.js";
import { EntityManager } from "./entities/entityManager.js";
import { RenderManager } from "./rendering/renderManager.js";
import { InputManager } from "./inputs/inputManager.js";
import { NetworkManager } from "./networkManager.js";
import { ANIMATION, ENTITY, RESOURCES, NETWORK } from "../constants.js";

export class GameController extends Game {
  constructor(options = {}) {
    super();
    
    // Opciones de configuración
    this.gameMode = options.gameMode || "singleplayer";
    this.playerType = options.playerType || null;
    
    // Inicializar componentes del juego
    this.entityManager = new EntityManager();
    this.renderManager = new RenderManager();
    this.inputManager = new InputManager();
    this.networkManager = options.socket ? 
      new NetworkManager(options.socket).configure(this.gameMode, this.playerType) : 
      null;
    
    // Variables de control
    this.entitySize = ENTITY.DEFAULT_SIZE;

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
    
    // Determinar qué entidad controlar según el modo de juego
    const controlledEntity = this.entityManager.getControlledEntity(
      this.gameMode, 
      this.playerType
    );
    
    // Determinar el factor de velocidad adecuado según la entidad controlada
    let speedFactor;
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
    
    // Inicializar el gestor de entrada
    this.inputManager.init(controlledEntity, speedFactor)
      .setPoopLaunchHandler(this.handlePoopLaunch.bind(this));
    
    // Configurar el gestor de red si estamos en modo multijugador
    if (this.networkManager) {
      this.networkManager.setupHandlers(this.entityManager, this.renderManager);
    } else {
      // En modo un jugador, siempre programar la generación de berries
      this.entityManager.scheduleNextBerrySpawn();
    }
    
    // Iniciar el bucle del juego
    requestAnimationFrame(this.startGameLoop.bind(this));

    return this;
  }
  
  // Método para manejar el lanzamiento de poop cuando se presiona la tecla espacio
  handlePoopLaunch(bird) {
    const poopEntity = this.entityManager.createPoopFromBird(bird);
    
    if (poopEntity) {
      // Si está en modo red, no necesitamos crear la vista aquí
      // ya que se sincronizará automáticamente en el bucle de render
      if (!this.networkManager) {
        this.renderManager.createPoopView(poopEntity);
      }
    }
  }

  // Actualización del juego
  update(deltaTime) {
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
  draw() {
    // Limpiar el canvas
    this.renderManager.clear();
    
    // Dibujar todas las entidades
    this.renderManager.draw(this.entityManager);
    
    // Actualizar las animaciones
    this.renderManager.updateAnimations();
  }
}
// Módulo principal del juego para abstraer la lógica común
import {
  EntityFactory,
  StaticEntity,
  RockEntity,
  BirdEntity,
  BreakableEntity,
  ColliderType,
  PhysicsComponent,
  DamageableComponent
} from "./entities.js";
import {
  EntityView,
  StaticSpriteEntityView,
  AnimatedEntityView,
} from "./entityViews.js";
import { DrawingPad } from "./drawingPad.js";
import {
  ANIMATION,
  UI,
  LEVEL,
  RESOURCES,
  ENTITY,
  NETWORK,
  NORMALIZED_SPACE,
  CANVAS
} from "./constants.js";

// Clase principal que gestiona el juego
export class ParabolicParabolaGameControler {
  constructor(options = {}) {
    // Canvas y contexto
    this.canvas = document.getElementById("canvas");
    this.drawingPadCanvas = document.getElementById("drawing-pad");
    this.ctx = this.canvas.getContext("2d");
    
    // Socket para modo multijugador
    this.socket = options.socket || null;
    
    // Opciones de configuración
    this.gameMode = options.gameMode || 'singleplayer';
    this.playerType = options.playerType || null;
    
    // Estado del juego
    this.gameObjects = [];
    this.views = {};
    this.frameCount = 0;
    this.lastTime = 0;
    
    // Entidades
    this.rockEntity = null;
    this.blueBirdEntity = null;
    this.greenBirdEntity = null;
    this.middlePlatform = null;
    this.berries = []; // Array para almacenar las berries
    
    // Trackeo de posición para multijugador
    this.lastPositionUpdate = {
      x: 0, y: 0, velocityX: 0, velocityY: 0
    };
    
    // Sprites
    this.sprites = {
      blueBird: [],
      greenBird: [],
      rock: null
    };
    
    // Variables de control
    this.entitySize = ENTITY.DEFAULT_SIZE;
    this.platformWidth = 4; // Ancho normalizado
    this.platformHeight = 0.2; // Alto normalizado
    
    // Tamaños visuales (usando las constantes definidas)
    this.visualSizes = {
      rock: {
        width: this.entitySize * UI.VISUAL.ROCK_SCALE,
        height: this.entitySize * UI.VISUAL.ROCK_SCALE
      },
      bird: {
        width: this.entitySize * UI.VISUAL.BIRD_SCALE,
        height: this.entitySize * UI.VISUAL.BIRD_SCALE
      }
    };
    
    // Controladora del pad de dibujo
    this.drawingPad = null;
    
    // Indica qué entidad se está controlando
    this.controlledEntity = null;
  }
  
  // Inicializa el juego
  async init() {
    await this.loadSprites();
    this.createEntities();
    this.createViews();
    this.setupEntities();
    this.setupDrawingPad();
    
    if (this.socket) {
      this.setupNetworkHandlers();
    }
    
    // Iniciar el bucle del juego
    requestAnimationFrame(this.startGameLoop.bind(this));
    
    return this;
  }
  
  // Carga todos los sprites necesarios
  async loadSprites() {
    // Función para cargar imágenes
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };
    
    // Cargar sprites de pájaros
    this.sprites.blueBird = await Promise.all(
      Array.from({ length: RESOURCES.IMAGES.BLUE_BIRD_FRAMES }, (_, i) =>
        loadImage(`${RESOURCES.IMAGES.BLUE_BIRD_PREFIX}${i}.png`)
      )
    );
    
    this.sprites.greenBird = await Promise.all(
      Array.from({ length: RESOURCES.IMAGES.GREEN_BIRD_FRAMES }, (_, i) =>
        loadImage(`${RESOURCES.IMAGES.GREEN_BIRD_PREFIX}${i}.png`)
      )
    );
    
    // Cargar sprite de la roca
    this.sprites.rock = await loadImage(RESOURCES.IMAGES.ROCK_PATH);
  }
  
  // Crea las entidades según el modo de juego
  createEntities() {
    // Crear la roca (ahora usando EntityFactory)
    this.rockEntity = EntityFactory.createRock(
      2, // x
      2, // y
      this.entitySize
    );
    
    // Pájaros (pueden ser BirdEntity o BreakableEntity según el modo)
    if (this.gameMode === 'singleplayer') {
      // En singleplayer ambos pájaros son rompibles pero no controlables
      this.blueBirdEntity = EntityFactory.createBird(
        6, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        10, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
    } else if (this.gameMode === 'birdplayer') {
      // En modo pájaro, ambos son controlables
      this.blueBirdEntity = EntityFactory.createBird(
        6, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        10, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
    } else if (this.gameMode === 'stoneplayer') {
      // En modo piedra, el azul es controlable y el verde es rompible
      this.blueBirdEntity = EntityFactory.createBird(
        6, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        10, 2, this.entitySize, ENTITY.BIRD.DEFAULT_HEALTH
      );
    }
    
    // Plataforma
    this.middlePlatform = EntityFactory.createPlatform(
      (NORMALIZED_SPACE.WIDTH / 2) - (this.platformWidth / 2),
      NORMALIZED_SPACE.HEIGHT / 2,
      this.platformWidth,
      this.platformHeight
    );
    
    // Crear 4 berries en diferentes posiciones del escenario
    // Berry 1 - Arriba a la izquierda
    this.berries.push(EntityFactory.createBerry(
      3, // x
      1, // y
      this.entitySize * 0.8 // Un poco más pequeñas que las entidades estándar
    ));
    
    // Berry 2 - Arriba a la derecha
    this.berries.push(EntityFactory.createBerry(
      13, // x
      1, // y
      this.entitySize * 0.8
    ));
    
    // Berry 3 - Cerca de la plataforma
    this.berries.push(EntityFactory.createBerry(
      NORMALIZED_SPACE.WIDTH / 2 - 2, // x (izquierda de la plataforma)
      NORMALIZED_SPACE.HEIGHT / 2 - 1, // y (justo encima de la plataforma)
      this.entitySize * 0.8
    ));
    
    // Berry 4 - Cerca de la plataforma por el lado derecho
    this.berries.push(EntityFactory.createBerry(
      NORMALIZED_SPACE.WIDTH / 2 + 2, // x (derecha de la plataforma)
      NORMALIZED_SPACE.HEIGHT / 2 - 1, // y (justo encima de la plataforma)
      this.entitySize * 0.8
    ));
    
    // Establecer la entidad controlada según el modo de juego
    if (this.gameMode === 'singleplayer' || this.gameMode === 'stoneplayer') {
      this.controlledEntity = this.rockEntity;
    } else if (this.gameMode === 'birdplayer') {
      this.controlledEntity = this.blueBirdEntity;
    }
    
    // Añadir etiquetas para identificar los tipos de entidades
    this.rockEntity.addTag('rock');
    this.blueBirdEntity.addTag('bird').addTag('blue');
    this.greenBirdEntity.addTag('bird').addTag('green');
    this.middlePlatform.addTag('platform');
  }
  
  // Crea las vistas para las entidades
  createViews() {
    // Vista para la roca - usando constantes para la configuración visual
    this.views.rock = new StaticSpriteEntityView(
      this.rockEntity, 
      this.sprites.rock, 
      {
        visualWidth: this.visualSizes.rock.width,
        visualHeight: this.visualSizes.rock.height,
        circular: true,
        scale: UI.VISUAL.ROCK_SCALE
      }
    );
    
    // Vista para el pájaro azul - usando constantes para la configuración visual
    this.views.blueBird = new AnimatedEntityView(
      this.blueBirdEntity, 
      this.sprites.blueBird, 
      {
        visualWidth: this.visualSizes.bird.width,
        visualHeight: this.visualSizes.bird.height,
        scale: UI.VISUAL.BIRD_SCALE,
        offsetY: UI.VISUAL.BIRD_OFFSET_Y
      }
    );
    
    // Vista para el pájaro verde - usando constantes para la configuración visual
    this.views.greenBird = new AnimatedEntityView(
      this.greenBirdEntity, 
      this.sprites.greenBird, 
      {
        visualWidth: this.visualSizes.bird.width,
        visualHeight: this.visualSizes.bird.height,
        scale: UI.VISUAL.BIRD_SCALE,
        offsetY: UI.VISUAL.BIRD_OFFSET_Y
      }
    );
    
    // Vista para la plataforma (sin sprite, solo colisionador)
    this.views.platform = new EntityView(this.middlePlatform);
  }
  
  // Configura las entidades y las añade al juego
  setupEntities() {
    this.gameObjects = [
      this.rockEntity,
      this.blueBirdEntity,
      this.greenBirdEntity,
      this.middlePlatform,
      ...this.berries // Añadir todas las berries al array de objetos del juego
    ];
    
    // Inicializar contadores de berries en los pájaros
    this.blueBirdEntity.berryCount = 0;
    this.greenBirdEntity.berryCount = 0;
  }
  
  // Configura el DrawingPad
  setupDrawingPad() {
    // Determinar el factor de velocidad adecuado según la entidad controlada
    let speedFactor;
    
    if (this.controlledEntity.hasTag && this.controlledEntity.hasTag('rock')) {
      // Para la roca usar los factores definidos en ENTITY.ROCK.LAUNCH_SPEED_FACTOR
      speedFactor = ENTITY.ROCK.LAUNCH_SPEED_FACTOR;
    } else if (this.controlledEntity.hasTag && this.controlledEntity.hasTag('bird')) {
      // Para los pájaros usar el factor único definido en ENTITY.BIRD.LAUNCH_SPEED_FACTOR
      speedFactor = {
        X: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
        Y: ENTITY.BIRD.LAUNCH_SPEED_FACTOR
      };
    } else {
      // Valor por defecto para otras entidades
      speedFactor = { X: 30, Y: 30 };
    }
    
    this.drawingPad = new DrawingPad(
      this.drawingPadCanvas,
      this.canvas,
      this.controlledEntity,
      speedFactor
    );
  }
  
  // Configura los handlers para el modo multijugador
  setupNetworkHandlers() {
    // Si estamos en modo pájaro
    if (this.gameMode === 'birdplayer') {
      // Actualiza la posición de la roca cuando recibe datos del otro jugador
      this.socket.on("updateRock", (position) => {
        this.rockEntity.x = position.x;
        this.rockEntity.y = position.y;
        
        // Actualizar la física directamente en el componente
        const physicsComp = this.rockEntity.getComponent(PhysicsComponent);
        if (physicsComp) {
          physicsComp.velocityX = position.velocityX;
          physicsComp.velocityY = position.velocityY;
        }
      });
      
      // Actualiza la posición inicial
      this.lastPositionUpdate = {
        x: this.blueBirdEntity.x,
        y: this.blueBirdEntity.y,
        velocityX: this.blueBirdEntity.velocityX || 0,
        velocityY: this.blueBirdEntity.velocityY || 0
      };
    } 
    // Si estamos en modo piedra
    else if (this.gameMode === 'stoneplayer') {
      // Actualiza la posición del pájaro azul cuando recibe datos del otro jugador
      this.socket.on("updateBlueBird", (position) => {
        this.blueBirdEntity.x = position.x;
        this.blueBirdEntity.y = position.y;
        
        // Actualizar la física directamente en el componente
        const physicsComp = this.blueBirdEntity.getComponent(PhysicsComponent);
        if (physicsComp) {
          physicsComp.velocityX = position.velocityX;
          physicsComp.velocityY = position.velocityY;
        }
      });
      
      // Actualiza la posición inicial
      this.lastPositionUpdate = {
        x: this.rockEntity.x,
        y: this.rockEntity.y,
        velocityX: this.rockEntity.velocityX || 0,
        velocityY: this.rockEntity.velocityY || 0
      };
    }
  }
  
  // Comprueba si la posición ha cambiado lo suficiente para enviarla
  hasPositionChanged(current, last) {
    return (
      Math.abs(current.x - last.x) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.y - last.y) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityX - last.velocityX) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityY - last.velocityY) > NETWORK.POSITION_THRESHOLD
    );
  }
  
  // Actualiza la posición en el servidor si es necesario
  updatePositionOnServer() {
    if (!this.socket) return;
    
    let currentState, socketEvent;
    
    // Determinar qué entidad estamos controlando y qué evento emitir
    if (this.gameMode === 'birdplayer') {
      const physicsComp = this.blueBirdEntity.getComponent(PhysicsComponent);
      currentState = {
        x: this.blueBirdEntity.x,
        y: this.blueBirdEntity.y,
        velocityX: physicsComp ? physicsComp.velocityX : 0,
        velocityY: physicsComp ? physicsComp.velocityY : 0
      };
      socketEvent = "blueBirdUpdate";
    } else if (this.gameMode === 'stoneplayer') {
      const physicsComp = this.rockEntity.getComponent(PhysicsComponent);
      currentState = {
        x: this.rockEntity.x,
        y: this.rockEntity.y,
        velocityX: physicsComp ? physicsComp.velocityX : 0,
        velocityY: physicsComp ? physicsComp.velocityY : 0
      };
      socketEvent = "rockUpdate";
    } else {
      return; // Modo single player, no actualiza
    }
    
    // Solo enviar si la posición ha cambiado significativamente
    if (this.hasPositionChanged(currentState, this.lastPositionUpdate)) {
      this.socket.emit(socketEvent, currentState);
      this.lastPositionUpdate = { ...currentState };
    }
  }
  
  // Comenzar el bucle del juego
  startGameLoop(time) {
    this.lastTime = time;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  // Bucle principal del juego
  gameLoop(currentTime) {
    // Calcular el delta time y limitar a un máximo
    const deltaTime = Math.min(
      (currentTime - this.lastTime) / 1000,
      ANIMATION.MAX_DELTA_TIME
    );
    this.lastTime = currentTime;
    
    // Limpiar el canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Filtrar entidades marcadas para eliminación
    const remainingObjects = this.gameObjects.filter(obj => {
      const damageComp = obj.getComponent(DamageableComponent);
      return !(damageComp && damageComp.markedForDeletion);
    });
    
    if (remainingObjects.length !== this.gameObjects.length) {
      this.gameObjects.length = 0;
      this.gameObjects.push(...remainingObjects);
    }
    
    // Actualizar todos los objetos
    for (const obj of this.gameObjects) {
      obj.update(this.gameObjects, deltaTime);
    }
    
    // Actualizar posición en el servidor si es modo multijugador
    this.updatePositionOnServer();
    
    // Dibujar todos los objetos
    this.draw();
    
    // Actualizar animaciones cada ciertos frames
    this.frameCount++;
    if (this.frameCount % ANIMATION.SPRITE_FRAME_SPEED === 0) {
      this.views.blueBird.nextFrame();
      this.views.greenBird.nextFrame();
    }
    
    // Continuar el bucle
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  // Dibuja todos los objetos del juego
  draw() {
    // Dibujar primero la plataforma
    this.views.platform.drawCollider(UI.COLLIDER_COLORS.PLATFORM);
    
    // Dibujar las berries (con un color rojo frambuesa en modo debug)
    for (const berry of this.berries) {
      // Solo dibujar si no están marcadas para eliminación
      const berryDamageComp = berry.getComponent(DamageableComponent);
      if (!berryDamageComp || !berryDamageComp.markedForDeletion) {
        // En modo debug, mostrar el colisionador con el color definido en constants
        if (UI.DEBUG_MODE) {
          const berryView = new EntityView(berry);
          berryView.drawCollider(ENTITY.BERRY.COLOR);
        } else {
          // Sin modo debug, dibujar un círculo rojo para representar la berry
          const berryView = new EntityView(berry);
          berryView.drawCircleCollider(ENTITY.BERRY.COLOR);
        }
      }
    }
    
    // Dibujar los pájaros si no están marcados para eliminación
    const blueBirdDamageComp = this.blueBirdEntity.getComponent(DamageableComponent);
    if (!blueBirdDamageComp || !blueBirdDamageComp.markedForDeletion) {
      this.views.blueBird.drawSprite();
      this.views.blueBird.drawHealthBar();
      this.views.blueBird.drawBerryCounter(); // Mostrar contador de berries
      
      // Opcionalmente mostrar el colisionador para depuración
      if (UI.DEBUG_MODE) {
        this.views.blueBird.drawCollider('rgba(0, 0, 255, 0.3)');
      }
    }
    
    const greenBirdDamageComp = this.greenBirdEntity.getComponent(DamageableComponent);
    if (!greenBirdDamageComp || !greenBirdDamageComp.markedForDeletion) {
      this.views.greenBird.drawSprite();
      this.views.greenBird.drawHealthBar();
      this.views.greenBird.drawBerryCounter(); // Mostrar contador de berries
      
      // Opcionalmente mostrar el colisionador para depuración
      if (UI.DEBUG_MODE) {
        this.views.greenBird.drawCollider('rgba(0, 255, 0, 0.3)');
      }
    }
    
    // Dibujar la roca por encima de los pájaros
    this.views.rock.drawSprite();
      
    // Opcionalmente mostrar el colisionador para depuración
    if (UI.DEBUG_MODE) {
      this.views.rock.drawCollider('rgba(255, 0, 0, 0.3)');
    }
  }
}
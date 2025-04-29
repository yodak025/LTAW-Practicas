// Módulo principal del juego para abstraer la lógica común
import {
  StaticEntity,
  RockEntity,
  BirdEntity,
  BreakableEntity,
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
    // Roca (siempre es RockEntity)
    this.rockEntity = new RockEntity(
      2, // x
      2, // y
      this.entitySize,
      this.entitySize
    );
    
    // Pájaros (pueden ser BirdEntity o BreakableEntity según el modo)
    if (this.gameMode === 'singleplayer') {
      // En singleplayer ambos pájaros son rompibles pero no controlables
      this.blueBirdEntity = new BreakableEntity(
        6, 2, this.entitySize, this.entitySize
      );
      this.greenBirdEntity = new BreakableEntity(
        10, 2, this.entitySize, this.entitySize
      );
    } else if (this.gameMode === 'birdplayer') {
      // En modo pájaro, ambos son BirdEntity (el azul es controlable)
      this.blueBirdEntity = new BirdEntity(
        6, 2, this.entitySize, this.entitySize
      );
      this.greenBirdEntity = new BirdEntity(
        10, 2, this.entitySize, this.entitySize
      );
    } else if (this.gameMode === 'stoneplayer') {
      // En modo piedra, el azul es BirdEntity y el verde es BreakableEntity
      this.blueBirdEntity = new BirdEntity(
        6, 2, this.entitySize, this.entitySize
      );
      this.greenBirdEntity = new BreakableEntity(
        10, 2, this.entitySize, this.entitySize
      );
    }
    
    // Plataforma
    this.middlePlatform = new StaticEntity(
      (NORMALIZED_SPACE.WIDTH / 2) - (this.platformWidth / 2),
      NORMALIZED_SPACE.HEIGHT / 2,
      this.platformWidth,
      this.platformHeight
    );
    
    // Establecer la entidad controlada según el modo de juego
    if (this.gameMode === 'singleplayer' || this.gameMode === 'stoneplayer') {
      this.controlledEntity = this.rockEntity;
    } else if (this.gameMode === 'birdplayer') {
      this.controlledEntity = this.blueBirdEntity;
    }
  }
  
  // Crea las vistas para las entidades
  createViews() {
    this.views.rock = new StaticSpriteEntityView(this.rockEntity, this.sprites.rock);
    this.views.blueBird = new AnimatedEntityView(this.blueBirdEntity, this.sprites.blueBird);
    this.views.greenBird = new AnimatedEntityView(this.greenBirdEntity, this.sprites.greenBird);
    this.views.platform = new EntityView(this.middlePlatform);
  }
  
  // Configura las entidades y las añade al juego
  setupEntities() {
    this.gameObjects = [
      this.rockEntity,
      this.blueBirdEntity,
      this.greenBirdEntity,
      this.middlePlatform
    ];
  }
  
  // Configura el DrawingPad
  setupDrawingPad() {
    this.drawingPad = new DrawingPad(
      this.drawingPadCanvas,
      this.canvas,
      this.controlledEntity
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
        this.rockEntity.velocityX = position.velocityX;
        this.rockEntity.velocityY = position.velocityY;
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
        this.blueBirdEntity.velocityX = position.velocityX;
        this.blueBirdEntity.velocityY = position.velocityY;
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
      currentState = {
        x: this.blueBirdEntity.x,
        y: this.blueBirdEntity.y,
        velocityX: this.blueBirdEntity.velocityX,
        velocityY: this.blueBirdEntity.velocityY
      };
      socketEvent = "blueBirdUpdate";
    } else if (this.gameMode === 'stoneplayer') {
      currentState = {
        x: this.rockEntity.x,
        y: this.rockEntity.y,
        velocityX: this.rockEntity.velocityX,
        velocityY: this.rockEntity.velocityY
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
    // En single player, filtrar BreakableEntity
    // En multiplayer, filtrar BirdEntity
    const EntityTypeToFilter = this.gameMode === 'singleplayer' ? 
      BreakableEntity : BirdEntity;
    
    const remainingObjects = this.gameObjects.filter(
      (obj) => !(obj instanceof EntityTypeToFilter && obj.markedForDeletion)
    );
    
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
    // Dibujar la roca
    this.views.rock.drawSprite();
    this.views.rock.drawCollider(UI.COLLIDER_COLORS.DEFAULT);
    
    // Dibujar la plataforma
    this.views.platform.drawCollider(UI.COLLIDER_COLORS.PLATFORM);
    
    // Dibujar los pájaros si no están marcados para eliminación
    if (!this.blueBirdEntity.markedForDeletion) {
      this.views.blueBird.drawSprite();
      this.views.blueBird.drawHealthBar();
    }
    
    if (!this.greenBirdEntity.markedForDeletion) {
      this.views.greenBird.drawSprite();
      this.views.greenBird.drawHealthBar();
    }
  }
}
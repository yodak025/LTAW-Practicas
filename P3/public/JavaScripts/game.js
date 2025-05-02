// Módulo principal del juego para abstraer la lógica común
import {
  EntityFactory,
  StaticEntity,
  RockEntity,
  BirdEntity,
  BreakableEntity,
  ColliderType,
  PhysicsComponent,
  DamageableComponent,
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
  CANVAS,
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
    this.gameMode = options.gameMode || "singleplayer";
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
    this.berries = []; // Array para almacenar las berries
    this.berryViews = []; // Array para almacenar las vistas de berries
    
    // Árboles (elementos decorativos)
    this.leftTreeEntity = null;
    this.rightTreeEntity = null;

    // Trackeo de posición para multijugador
    this.lastPositionUpdate = {
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
    };

    // Sprites
    this.sprites = {
      blueBird: [],
      greenBird: [],
      rock: null,
      berries: [], // Array para sprites de berries
      tree: null, // Sprite para los árboles
    };

    // Variables de control
    this.entitySize = ENTITY.DEFAULT_SIZE;
    this.platformWidth = 4; // Ancho normalizado
    this.platformHeight = 0.2; // Alto normalizado

    // Tamaños visuales (usando las constantes definidas)
    this.visualSizes = {
      rock: {
        width: this.entitySize * UI.VISUAL.ROCK_SCALE,
        height: this.entitySize * UI.VISUAL.ROCK_SCALE,
      },
      bird: {
        width: this.entitySize * UI.VISUAL.BIRD_SCALE,
        height: this.entitySize * UI.VISUAL.BIRD_SCALE,
      },
      berry: {
        width: this.entitySize * UI.VISUAL.BERRY_SCALE,
        height: this.entitySize * UI.VISUAL.BERRY_SCALE,
      },
    };

    // Controladora del pad de dibujo
    this.drawingPad = null;

    // Indica qué entidad se está controlando
    this.controlledEntity = null;
    
    // Temporizadores para generación de berries
    this.nextBerrySpawnTime = 0;
    this.berrySpawnElapsedTime = 0;
    
    // Contadores de berries por árbol
    this.leftTreeBerryCount = 0;
    this.rightTreeBerryCount = 0;
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
    
    // Programar la primera generación de berries
    this.scheduleNextBerrySpawn();

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
      Array.from({ length: RESOURCES.SPRITES.BLUE_BIRD_FRAMES }, (_, i) =>
        loadImage(`${RESOURCES.SPRITES.BLUE_BIRD_PREFIX}${i}.png`)
      )
    );

    this.sprites.greenBird = await Promise.all(
      Array.from({ length: RESOURCES.SPRITES.GREEN_BIRD_FRAMES }, (_, i) =>
        loadImage(`${RESOURCES.SPRITES.GREEN_BIRD_PREFIX}${i}.png`)
      )
    );

    this.sprites.berries = await Promise.all(
      Array.from({ length: RESOURCES.SPRITES.BERRIES_COUNT }, (_, i) =>
        loadImage(`${RESOURCES.SPRITES.BERRY_PREFIX}${i}.png`)
      )
    );

    // Cargar sprite de la roca
    this.sprites.rock = await loadImage(RESOURCES.SPRITES.ROCK_PATH);
    
    // Cargar sprite del árbol
    this.sprites.tree = await loadImage(RESOURCES.SPRITES.TREE_PATH);
  }

  // Crea las entidades según el modo de juego
  createEntities() {
    // Crear la roca (ahora usando EntityFactory)
    this.rockEntity = EntityFactory.createRock(
      2, // x
      2, // y
      ENTITY.ROCK.RADIO * 2 // Diámetro para la roca
    );

    // Pájaros (pueden ser BirdEntity o BreakableEntity según el modo)
    if (this.gameMode === "singleplayer") {
      // En singleplayer ambos pájaros son rompibles pero no controlables
      this.blueBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.BLUE.x,
        ENTITY.BIRD.POSITIONS.BLUE.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.GREEN.x,
        ENTITY.BIRD.POSITIONS.GREEN.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
    } else if (this.gameMode === "birdplayer") {
      // En modo pájaro, ambos son controlables
      this.blueBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.BLUE.x,
        ENTITY.BIRD.POSITIONS.BLUE.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.GREEN.x,
        ENTITY.BIRD.POSITIONS.GREEN.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
    } else if (this.gameMode === "stoneplayer") {
      // En modo piedra, el azul es controlable y el verde es rompible
      this.blueBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.BLUE.x,
        ENTITY.BIRD.POSITIONS.BLUE.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
      this.greenBirdEntity = EntityFactory.createBird(
        ENTITY.BIRD.POSITIONS.GREEN.x,
        ENTITY.BIRD.POSITIONS.GREEN.y,
        ENTITY.BIRD.SIZE,
        ENTITY.BIRD.DEFAULT_HEALTH
      );
    }

    // Crear árboles decorativos (sin colisiones)
    this.leftTreeEntity = EntityFactory.createDecorative(
      ENTITY.TREES.LEFT.x,
      ENTITY.TREES.LEFT.y,
      ENTITY.TREES.SIZE.width,
      ENTITY.TREES.SIZE.height
    );
    
    this.rightTreeEntity = EntityFactory.createDecorative(
      ENTITY.TREES.RIGHT.x,
      ENTITY.TREES.RIGHT.y,
      ENTITY.TREES.SIZE.width, 
      ENTITY.TREES.SIZE.height
    );

    // No creamos berries aquí, se generarán dinámicamente
    this.berries = [];

    // Establecer la entidad controlada según el modo de juego
    if (this.gameMode === "singleplayer" || this.gameMode === "stoneplayer") {
      this.controlledEntity = this.rockEntity;
    } else if (this.gameMode === "birdplayer") {
      this.controlledEntity = this.blueBirdEntity;
    }

    // Añadir etiquetas para identificar los tipos de entidades
    this.rockEntity.addTag("rock");
    this.blueBirdEntity.addTag("bird").addTag("blue");
    this.greenBirdEntity.addTag("bird").addTag("green");
    this.leftTreeEntity.addTag("tree").addTag("decorative").addTag("left");
    this.rightTreeEntity.addTag("tree").addTag("decorative").addTag("right");
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
        scale: UI.VISUAL.ROCK_SCALE,
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
        offsetY: UI.VISUAL.BIRD_OFFSET_Y,
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
        offsetY: UI.VISUAL.BIRD_OFFSET_Y,
      }
    );

    // Vistas para los árboles decorativos
    this.views.leftTree = new StaticSpriteEntityView(
      this.leftTreeEntity,
      this.sprites.tree,
      {
        visualWidth: ENTITY.TREES.SIZE.width,
        visualHeight: ENTITY.TREES.SIZE.height,
        scale: ENTITY.TREES.SCALE,
      }
    );
    
    this.views.rightTree = new StaticSpriteEntityView(
      this.rightTreeEntity,
      this.sprites.tree,
      {
        visualWidth: ENTITY.TREES.SIZE.width,
        visualHeight: ENTITY.TREES.SIZE.height,
        scale: ENTITY.TREES.SCALE,
      }
    );
    
    // No creamos vistas para las berries aquí, se generarán dinámicamente
    this.berryViews = [];
  }

  // Configura las entidades y las añade al juego
  setupEntities() {
    this.gameObjects = [
      this.rockEntity,
      this.blueBirdEntity,
      this.greenBirdEntity,
      // No incluimos las berries aquí, se añadirán dinámicamente
      // No incluimos los árboles porque son decorativos y no participan en colisiones
    ];

    // Inicializar contadores de berries en los pájaros
    this.blueBirdEntity.berryCount = 0;
    this.greenBirdEntity.berryCount = 0;
  }

  // Configura el DrawingPad
  setupDrawingPad() {
    // Determinar el factor de velocidad adecuado según la entidad controlada
    let speedFactor;

    if (this.controlledEntity.hasTag && this.controlledEntity.hasTag("rock")) {
      // Para la roca usar los factores definidos en ENTITY.ROCK.LAUNCH_SPEED_FACTOR
      speedFactor = ENTITY.ROCK.LAUNCH_SPEED_FACTOR;
    } else if (
      this.controlledEntity.hasTag &&
      this.controlledEntity.hasTag("bird")
    ) {
      // Para los pájaros usar el factor único definido en ENTITY.BIRD.LAUNCH_SPEED_FACTOR
      speedFactor = {
        X: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
        Y: ENTITY.BIRD.LAUNCH_SPEED_FACTOR,
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
    if (this.gameMode === "birdplayer") {
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
        velocityY: this.blueBirdEntity.velocityY || 0,
      };
    }
    // Si estamos en modo piedra
    else if (this.gameMode === "stoneplayer") {
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
        velocityY: this.rockEntity.velocityY || 0,
      };
    }
  }

  // Comprueba si la posición ha cambiado lo suficiente para enviarla
  hasPositionChanged(current, last) {
    return (
      Math.abs(current.x - last.x) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.y - last.y) > NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityX - last.velocityX) >
        NETWORK.POSITION_THRESHOLD ||
      Math.abs(current.velocityY - last.velocityY) > NETWORK.POSITION_THRESHOLD
    );
  }

  // Actualiza la posición en el servidor si es necesario
  updatePositionOnServer() {
    if (!this.socket) return;

    let currentState, socketEvent;

    // Determinar qué entidad estamos controlando y qué evento emitir
    if (this.gameMode === "birdplayer") {
      const physicsComp = this.blueBirdEntity.getComponent(PhysicsComponent);
      currentState = {
        x: this.blueBirdEntity.x,
        y: this.blueBirdEntity.y,
        velocityX: physicsComp ? physicsComp.velocityX : 0,
        velocityY: physicsComp ? physicsComp.velocityY : 0,
      };
      socketEvent = "blueBirdUpdate";
    } else if (this.gameMode === "stoneplayer") {
      const physicsComp = this.rockEntity.getComponent(PhysicsComponent);
      currentState = {
        x: this.rockEntity.x,
        y: this.rockEntity.y,
        velocityX: physicsComp ? physicsComp.velocityX : 0,
        velocityY: physicsComp ? physicsComp.velocityY : 0,
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

  // Programar la próxima generación de berry
  scheduleNextBerrySpawn() {
    const minTime = ENTITY.BERRY.GENERATION.MIN_SPAWN_TIME;
    const maxTime = ENTITY.BERRY.GENERATION.MAX_SPAWN_TIME;
    // Tiempo aleatorio en segundos entre el mínimo y máximo configurados
    this.nextBerrySpawnTime = minTime + Math.random() * (maxTime - minTime);
    this.berrySpawnElapsedTime = 0;
  }
  
  // Genera berries aleatorias en el árbol especificado
  generateBerryInTree(tree) {
    // Verificar si podemos generar más berries
    const totalBerries = this.berries.length;
    const maxTotal = ENTITY.BERRY.GENERATION.MAX_TOTAL;
    const maxPerTree = ENTITY.BERRY.GENERATION.MAX_PER_TREE;
    
    // No generar si ya alcanzamos el máximo total
    if (totalBerries >= maxTotal) {
      return false;
    }
    
    // Verificar límite por árbol
    let currentTreeBerryCount;
    if (tree.hasTag("left")) {
      if (this.leftTreeBerryCount >= maxPerTree) return generateBerryInTree(this.rightTreeEntity);
      currentTreeBerryCount = this.leftTreeBerryCount;
    } else {
      if (this.rightTreeBerryCount >= maxPerTree) return generateBerryInTree(this.leftTreeEntity);
      currentTreeBerryCount = this.rightTreeBerryCount;
    }
    
    // Calcular la región circular en la mitad superior del árbol
    // La mitad superior está a la altura del árbol / 2 desde la posición Y del árbol
    // en un sistema donde Y crece hacia abajo (invertido)
    const treeWidth = tree.width;
    const treeHeight = tree.height;
    const centerX = tree.x + treeWidth / 2;
    const centerY = tree.y + treeHeight / 4; // Primer cuarto del árbol (mitad de la mitad superior)
    
    // Radio de la región circular (70% del ancho del árbol)
    const radius = treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR / 2;
    
    // Intentos para evitar colisiones
    const maxAttempts = 15;
    let attempts = 0;
    let berryX, berryY;
    let validPosition = false;
    
    // Intentar encontrar una posición válida
    while (!validPosition && attempts < maxAttempts) {
      // Generar posición aleatoria dentro del círculo
      const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
      const distance = Math.sqrt(Math.random()) * radius; // Distancia aleatoria desde el centro (raíz cuadrada para distribución uniforme)
      
      berryX = centerX + distance * Math.cos(angle);
      berryY = centerY + distance * Math.sin(angle);
      
      // Verificar si la posición está dentro de los límites y no colisiona con otras berries
      validPosition = this.isValidBerryPosition(berryX, berryY);
      attempts++;
    }
    
    // Si encontramos una posición válida, crear la berry
    if (validPosition) {
      // Crear la berry
      const newBerry = EntityFactory.createBerry(
        berryX,
        berryY,
        ENTITY.BERRY.RADIO * 2
      );
      
      // Añadir etiqueta para identificar en qué árbol está
      newBerry.addTag("berry");
      if (tree.hasTag("left")) {
        newBerry.addTag("left-tree");
        this.leftTreeBerryCount++;
      } else {
        newBerry.addTag("right-tree");
        this.rightTreeBerryCount++;
      }
      
      // Seleccionar un sprite aleatorio para la berry
      const randomSpriteIndex = Math.floor(Math.random() * this.sprites.berries.length);
      
      // Crear vista para la berry
      const newBerryView = new StaticSpriteEntityView(
        newBerry,
        this.sprites.berries[randomSpriteIndex],
        {
          visualWidth: this.visualSizes.berry.width,
          visualHeight: this.visualSizes.berry.height,
          circular: true,
          scale: UI.VISUAL.BERRY_SCALE,
        }
      );
      
      // Añadir la berry y su vista a los arrays
      this.berries.push(newBerry);
      this.berryViews.push(newBerryView);
      this.gameObjects.push(newBerry);
      
      return true;
    }
    
    return false;
  }
  
  // Verifica si una posición es válida para generar una berry (sin colisiones)
  isValidBerryPosition(x, y) {
    // Verificar que esté dentro de los límites del juego
    if (x < 0 || x > NORMALIZED_SPACE.WIDTH || y < 0 || y > NORMALIZED_SPACE.HEIGHT) {
      return false;
    }
    
    // Verificar colisiones con otras berries
    const berryRadius = ENTITY.BERRY.RADIO;
    for (const berry of this.berries) {
      const distance = Math.sqrt(
        Math.pow(berry.x - x, 2) + Math.pow(berry.y - y, 2)
      );
      
      // Si la distancia es menor que la suma de los radios, hay colisión
      if (distance < berryRadius * 2) {
        return false;
      }
    }
    
    return true;
  }
  
  // Actualiza los contadores de berries cuando una berry es eliminada
  updateBerryCounters() {
    this.leftTreeBerryCount = 0;
    this.rightTreeBerryCount = 0;
    
    for (const berry of this.berries) {
      if (!berry.getComponent(DamageableComponent).markedForDeletion) {
        if (berry.hasTag("left-tree")) {
          this.leftTreeBerryCount++;
        } else if (berry.hasTag("right-tree")) {
          this.rightTreeBerryCount++;
        }
      }
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
    const remainingObjects = this.gameObjects.filter((obj) => {
      const damageComp = obj.getComponent(DamageableComponent);
      return !(damageComp && damageComp.markedForDeletion);
    });

    if (remainingObjects.length !== this.gameObjects.length) {
      // Actualizar contadores de berries cuando algunas son eliminadas
      this.updateBerryCounters();
      
      this.gameObjects.length = 0;
      this.gameObjects.push(...remainingObjects);
      
      // También necesitamos limpiar el array de berries y sus vistas
      const remainingBerries = this.berries.filter((berry) => {
        const damageComp = berry.getComponent(DamageableComponent);
        return !(damageComp && damageComp.markedForDeletion);
      });
      
      const remainingBerryViews = [];
      for (let i = 0; i < this.berryViews.length; i++) {
        const berry = this.berries[i];
        const damageComp = berry.getComponent(DamageableComponent);
        if (!(damageComp && damageComp.markedForDeletion)) {
          remainingBerryViews.push(this.berryViews[i]);
        }
      }
      
      this.berries = remainingBerries;
      this.berryViews = remainingBerryViews;
    }

    // Actualizar todos los objetos
    for (const obj of this.gameObjects) {
      obj.update(this.gameObjects, deltaTime);
    }

    // Actualizar posición en el servidor si es modo multijugador
    this.updatePositionOnServer();

    // Sistema de generación de berries
    this.berrySpawnElapsedTime += deltaTime;
    if (this.berrySpawnElapsedTime >= this.nextBerrySpawnTime) {
      // Es hora de intentar generar una berry
      const totalBerries = this.berries.length;
      const maxTotal = ENTITY.BERRY.GENERATION.MAX_TOTAL;
      
      if (totalBerries < maxTotal) {
        // Elegir un árbol aleatorio para generar la berry
        const trees = [this.leftTreeEntity, this.rightTreeEntity];
        // Barajamos los árboles para elegir uno aleatoriamente
        const randomTreeIndex = Math.floor(Math.random() * trees.length);
        
        let success = false;
        // generamos la berry en el árbol elegido
        while (!success && trees.length > 1) {
          success = this.generateBerryInTree(trees[randomTreeIndex]);
        }
      }
      
      // Programar la próxima generación
      this.scheduleNextBerrySpawn();
    }

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
    // Dibujar primero los árboles como fondo
    this.views.leftTree.drawSprite();
    this.views.rightTree.drawSprite();
    
    // En modo debug, mostrar los límites de los árboles
    if (UI.DEBUG_MODE) {
      this.views.leftTree.drawRect(
        this.leftTreeEntity.x,
        this.leftTreeEntity.y,
        this.leftTreeEntity.width,
        this.leftTreeEntity.height,
        "rgba(0, 128, 0, 0.2)" // Verde transparente
      );
      
      this.views.rightTree.drawRect(
        this.rightTreeEntity.x,
        this.rightTreeEntity.y,
        this.rightTreeEntity.width,
        this.rightTreeEntity.height,
        "rgba(0, 128, 0, 0.2)" // Verde transparente
      );
      
      // Mostrar las áreas de generación de berries
      this.drawBerryGenerationAreas();
    }

    // Dibujar las berries usando sus vistas pre-creadas
    this.berries.forEach((berry, index) => {
      // Solo dibujar si no están marcadas para eliminación
      const berryDamageComp = berry.getComponent(DamageableComponent);
      if (!berryDamageComp || !berryDamageComp.markedForDeletion) {
        // Usar la vista pre-creada para esta berry
        if (index < this.berryViews.length) {
          this.berryViews[index].drawSprite();
          
          // En modo debug, mostrar el colisionador
          if (UI.DEBUG_MODE) {
            this.berryViews[index].drawCollider(ENTITY.BERRY.COLOR);
          }
        }
      }
    });

    // Dibujar los pájaros si no están marcados para eliminación
    const blueBirdDamageComp =
      this.blueBirdEntity.getComponent(DamageableComponent);
    if (!blueBirdDamageComp || !blueBirdDamageComp.markedForDeletion) {
      this.views.blueBird.drawSprite();
      this.views.blueBird.drawHealthBar();
      this.views.blueBird.drawBerryCounter(); // Mostrar contador de berries

      // Opcionalmente mostrar el colisionador para depuración
      if (UI.DEBUG_MODE) {
        this.views.blueBird.drawCollider(ENTITY.BIRD.BLUE_COLOR);
      }
    }

    const greenBirdDamageComp =
      this.greenBirdEntity.getComponent(DamageableComponent);
    if (!greenBirdDamageComp || !greenBirdDamageComp.markedForDeletion) {
      this.views.greenBird.drawSprite();
      this.views.greenBird.drawHealthBar();
      this.views.greenBird.drawBerryCounter(); // Mostrar contador de berries

      // Opcionalmente mostrar el colisionador para depuración
      if (UI.DEBUG_MODE) {
        this.views.greenBird.drawCollider(ENTITY.BIRD.GREEN_COLOR);
      }
    }

    // Dibujar la roca por encima de los pájaros
    this.views.rock.drawSprite();

    // Opcionalmente mostrar el colisionador para depuración
    if (UI.DEBUG_MODE) {
      this.views.rock.drawCollider(ENTITY.ROCK.COLOR);
    }
  }
  
  // Dibuja las áreas de generación de berries para depuración
  drawBerryGenerationAreas() {
    // Solo mostrar en modo debug
    if (!UI.DEBUG_MODE) return;
    
    const trees = [this.leftTreeEntity, this.rightTreeEntity];
    
    trees.forEach(tree => {
      const treeWidth = tree.width;
      const treeHeight = tree.height;
      const centerX = tree.x + treeWidth / 2;
      const centerY = tree.y + treeHeight / 4; // Centro de la mitad superior
      
      // Radio de la región circular (70% del ancho del árbol)
      const radius = treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR / 2;
      
      // Convertir coordenadas normalizadas a coordenadas de canvas
      const canvasX = centerX * this.canvas.width / NORMALIZED_SPACE.WIDTH;
      const canvasY = centerY * this.canvas.height / NORMALIZED_SPACE.HEIGHT;
      const canvasRadius = radius * this.canvas.width / NORMALIZED_SPACE.WIDTH;
      
      // Dibujar círculo
      this.ctx.beginPath();
      this.ctx.arc(canvasX, canvasY, canvasRadius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Amarillo semitransparente
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Dibujar centro
      this.ctx.beginPath();
      this.ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; // Rojo
      this.ctx.fill();
    });
  }
}

// Gestor de renderizado para separar la lógica visual
import {
  EntityView,
  StaticSpriteEntityView,
  AnimatedEntityView,
  PoopSpriteEntityView,
} from "./entityViews.js";
import { DamageableComponent } from "../entities/entities.js";
import { ANIMATION, UI, ENTITY, NORMALIZED_SPACE, RESOURCES } from "../../constants.js";

export class RenderManager {
  constructor() {
    // Canvas y contexto
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    // Colección de vistas de entidades
    this.views = {};
    this.berryViews = [];
    this.poopViews = [];
    
    // Contadores
    this.frameCount = 0;
    
    // Tamaños visuales
    this.visualSizes = {
      stone: { width: 0, height: 0 },
      bird: { width: 0, height: 0 },
      berry: { width: 0, height: 0 },
      poop: { width: 0, height: 0 },
    };
    
    // Sprites
    this.sprites = {
      blueBird: [],
      greenBird: [],
      stone: null,
      berries: [],
      tree: null,
      poop: {
        falling: null,
        landed: null,
      },
    };
  }
  
  // Inicializar tamaños visuales
  initVisualSizes(entitySize) {
    this.visualSizes = {
      stone: {
        width: entitySize * UI.VISUAL.STONE_SCALE,
        height: entitySize * UI.VISUAL.STONE_SCALE,
      },
      bird: {
        width: entitySize * UI.VISUAL.BIRD_SCALE,
        height: entitySize * UI.VISUAL.BIRD_SCALE,
      },
      berry: {
        width: entitySize * UI.VISUAL.BERRY_SCALE,
        height: entitySize * UI.VISUAL.BERRY_SCALE,
      },
      poop: {
        width: entitySize * UI.VISUAL.POOP_SCALE,
        height: entitySize * UI.VISUAL.POOP_SCALE,
      },
    };
  }
  
  // Cargar sprites
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
    this.sprites.stone = await loadImage(RESOURCES.SPRITES.STONE_PATH);

    // Cargar sprite del árbol
    this.sprites.tree = await loadImage(RESOURCES.SPRITES.TREE_PATH);

    // Cargar sprites de poop
    this.sprites.poop.falling = await loadImage(
      RESOURCES.SPRITES.POOP_FALLING_PATH
    );
    this.sprites.poop.landed = await loadImage(
      RESOURCES.SPRITES.POOP_LANDED_PATH
    );
  }
  
  // Crear vistas para las entidades
  createViews(entityManager) {
    // Vista para la roca
    this.views.stone = new StaticSpriteEntityView(
      entityManager.stoneEntity,
      this.sprites.stone,
      {
        visualWidth: this.visualSizes.stone.width,
        visualHeight: this.visualSizes.stone.height,
        circular: true,
        scale: UI.VISUAL.STONE_SCALE,
      }
    );

    // Vista para el pájaro azul
    this.views.blueBird = new AnimatedEntityView(
      entityManager.blueBirdEntity,
      this.sprites.blueBird,
      {
        visualWidth: this.visualSizes.bird.width,
        visualHeight: this.visualSizes.bird.height,
        scale: UI.VISUAL.BIRD_SCALE,
        offsetY: UI.VISUAL.BIRD_OFFSET_Y,
      }
    );

    // Vista para el pájaro verde
    this.views.greenBird = new AnimatedEntityView(
      entityManager.greenBirdEntity,
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
      entityManager.leftTreeEntity,
      this.sprites.tree,
      {
        visualWidth: ENTITY.TREES.SIZE.width,
        visualHeight: ENTITY.TREES.SIZE.height,
        scale: ENTITY.TREES.SCALE,
      }
    );

    this.views.rightTree = new StaticSpriteEntityView(
      entityManager.rightTreeEntity,
      this.sprites.tree,
      {
        visualWidth: ENTITY.TREES.SIZE.width,
        visualHeight: ENTITY.TREES.SIZE.height,
        scale: ENTITY.TREES.SCALE,
      }
    );
  }
  
  // Crear vista para una berry
  createBerryView(berry) {
    // Usar el spriteIndex de la berry si existe, o uno aleatorio si no
    const spriteIndex = typeof berry.spriteIndex === 'number' ? 
      berry.spriteIndex : Math.floor(Math.random() * this.sprites.berries.length);
    
    // Crear vista para la berry
    const berryView = new StaticSpriteEntityView(
      berry,
      this.sprites.berries[spriteIndex],
      {
        visualWidth: this.visualSizes.berry.width,
        visualHeight: this.visualSizes.berry.height,
        circular: true,
        scale: UI.VISUAL.BERRY_SCALE,
      }
    );
    
    this.berryViews.push(berryView);
    return berryView;
  }
  
  // Crear vista para un poop
  createPoopView(poop) {
    const poopView = new PoopSpriteEntityView(
      poop,
      this.sprites.poop.falling,
      this.sprites.poop.landed,
      {
        visualWidth: this.visualSizes.poop.width,
        visualHeight: this.visualSizes.poop.height,
        circular: true,
        scale: UI.VISUAL.POOP_SCALE,
      }
    );
    
    this.poopViews.push(poopView);
    return poopView;
  }
  
  // Sincronizar vistas de berries con entidades
  syncBerryViews(entityManager) {
    // Asegurarse de que hay una vista para cada berry
  for (let i = 0; i < entityManager.berries.length; i++) {
    const berry = entityManager.berries[i];
    
    // Verificar si ya existe una vista para esta berry
    let viewExists = false;
    for (let j = 0; j < this.berryViews.length; j++) {
      if (this.berryViews[j].entity.id === berry.id) { 
        viewExists = true;
        break;
      }
    }
    
    // Si no existe una vista, crearla
    if (!viewExists) {
      this.createBerryView(berry);
    }
  }
  
  // Eliminar vistas de berries que ya no existen
  this.berryViews = this.berryViews.filter(view => 
    entityManager.berries.includes(view.entity));
}
  
  // Sincronizar vistas de poops con entidades
  syncPoopViews(entityManager) {
    // Asegurarse de que hay una vista para cada poop
    while (this.poopViews.length < entityManager.poops.length) {
      const poop = entityManager.poops[this.poopViews.length];
      this.createPoopView(poop);
    }
    
    // Eliminar vistas sobrantes si algunos poops fueron eliminados
    if (this.poopViews.length > entityManager.poops.length) {
      this.poopViews.length = entityManager.poops.length;
    }
  }
  
  // Limpiar canvas
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  // Dibuja todos los objetos del juego
  draw(entityManager, debugMode = UI.DEBUG_MODE) {
    // Sincronizar vistas con entidades
    this.syncBerryViews(entityManager);
    this.syncPoopViews(entityManager);
    
    // Dibujar primero los árboles como fondo
    this.views.leftTree.drawSprite();
    this.views.rightTree.drawSprite();

    // En modo debug, mostrar los límites de los árboles
    if (debugMode) {
      this.views.leftTree.drawRect(
        entityManager.leftTreeEntity.x,
        entityManager.leftTreeEntity.y,
        entityManager.leftTreeEntity.width,
        entityManager.leftTreeEntity.height,
        "rgba(0, 128, 0, 0.2)" // Verde transparente
      );

      this.views.rightTree.drawRect(
        entityManager.rightTreeEntity.x,
        entityManager.rightTreeEntity.y,
        entityManager.rightTreeEntity.width,
        entityManager.rightTreeEntity.height,
        "rgba(0, 128, 0, 0.2)" // Verde transparente
      );

      // Mostrar las áreas de generación de berries
      this.drawBerryGenerationAreas(entityManager);
    }

    // Dibujar las berries
    entityManager.berries.forEach((berry) => {
      const berryDamageComp = berry.getComponent(DamageableComponent);
      if (!berryDamageComp || !berryDamageComp.markedForDeletion) {
        // Encontrar la vista correspondiente por ID en lugar de índice
        const berryView = this.berryViews.find(view => view.entity.id === berry.id);
        if (berryView) {
          console.log("Dibujando berry con posición:", berry.x, berry.y);
          berryView.drawSprite();
          console.log("Berry dibujada con posición:", berry.x, berry.y);
          if (debugMode) {
            berryView.drawCollider(ENTITY.BERRY.COLOR);
          }
        }
      }
    });

    // Dibujar los poops
    entityManager.poops.forEach((poop, index) => {
      // Solo dibujar si no están marcados para eliminación
      const poopDamageComp = poop.getComponent(DamageableComponent);
      if (!poopDamageComp || !poopDamageComp.markedForDeletion) {
        if (index < this.poopViews.length) {
          this.poopViews[index].drawSprite();

          // En modo debug, mostrar el colisionador
          if (debugMode) {
            this.poopViews[index].drawCollider(ENTITY.POOP.COLOR);
          }
        }
      }
    });

    // Dibujar los pájaros si no están marcados para eliminación
    const blueBirdDamageComp = entityManager.blueBirdEntity.getComponent(DamageableComponent);
    if (!blueBirdDamageComp || !blueBirdDamageComp.markedForDeletion) {
      this.views.blueBird.drawSprite();
      this.views.blueBird.drawHealthBar();
      this.views.blueBird.drawBerryCounter();

      // Opcionalmente mostrar el colisionador para depuración
      if (debugMode) {
        this.views.blueBird.drawCollider(ENTITY.BIRD.BLUE_COLOR);
      }
    }

    const greenBirdDamageComp = entityManager.greenBirdEntity.getComponent(DamageableComponent);
    if (!greenBirdDamageComp || !greenBirdDamageComp.markedForDeletion) {
      this.views.greenBird.drawSprite();
      this.views.greenBird.drawHealthBar();
      this.views.greenBird.drawBerryCounter();

      // Opcionalmente mostrar el colisionador para depuración
      if (debugMode) {
        this.views.greenBird.drawCollider(ENTITY.BIRD.GREEN_COLOR);
      }
    }

    // Dibujar la roca por encima de los pájaros
    this.views.stone.drawSprite();

    // Opcionalmente mostrar el colisionador para depuración
    if (debugMode) {
      this.views.stone.drawCollider(ENTITY.STONE.COLOR);
    }
  }
  
  // Actualizar animaciones
  updateAnimations() {
    this.frameCount++;
    if (this.frameCount % ANIMATION.SPRITE_FRAME_SPEED === 0) {
      this.views.blueBird?.nextFrame();
      this.views.greenBird?.nextFrame();
    }
  }
  
  // Dibuja las áreas de generación de berries para depuración
  drawBerryGenerationAreas(entityManager) {
    const trees = [entityManager.leftTreeEntity, entityManager.rightTreeEntity];

    trees.forEach((tree) => {
      const treeWidth = tree.width;
      const treeHeight = tree.height;
      const centerX = tree.x + treeWidth / 2;
      const centerY = tree.y + treeHeight / 4; // Centro de la mitad superior

      // Radio de la región circular (70% del ancho del árbol)
      const radius = (treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR) / 2;

      // Convertir coordenadas normalizadas a coordenadas de canvas
      const canvasX = (centerX * this.canvas.width) / NORMALIZED_SPACE.WIDTH;
      const canvasY = (centerY * this.canvas.height) / NORMALIZED_SPACE.HEIGHT;
      const canvasRadius = (radius * this.canvas.width) / NORMALIZED_SPACE.WIDTH;

      // Dibujar círculo
      this.ctx.beginPath();
      this.ctx.arc(canvasX, canvasY, canvasRadius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "rgba(255, 255, 0, 0.5)"; // Amarillo semitransparente
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Dibujar centro
      this.ctx.beginPath();
      this.ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Rojo
      this.ctx.fill();
    });
  }
}
// Gestor de entidades del juego
import { EntityFactory, DamageableComponent, BerryEntity } from "./entities.js";
import { ENTITY, UI, NORMALIZED_SPACE } from "../../constants.js";

export class EntityManager {
  constructor() {
    // Colecciones de entidades
    this.gameObjects = [];    // Todos los objetos del juego
    this.berries = [];        // Array para almacenar las berries
    this.poops = [];          // Array para almacenar los poops
    
    // Entidades principales
    this.stoneEntity = null;   // La piedra principal
    this.blueBirdEntity = null; // El pájaro azul
    this.greenBirdEntity = null; // El pájaro verde
    this.leftTreeEntity = null;  // Árbol decorativo izquierdo
    this.rightTreeEntity = null; // Árbol decorativo derecho
    
    // Contadores de berries por árbol
    this.leftTreeBerryCount = 0;
    this.rightTreeBerryCount = 0;

    // Temporizadores para generación de berries
    this.nextBerrySpawnTime = 0;
    this.berrySpawnElapsedTime = 0;
  }

  // Crear entidades básicas
  createEntities(gameMode) {
    // Crear la roca
    this.stoneEntity = EntityFactory.createStone(
      ENTITY.STONE.POSITIONS?.x || 2, 
      ENTITY.STONE.POSITIONS?.y || 2, 
      ENTITY.STONE.RADIO * 2 // Diámetro para la roca
    );

    // Pájaros según el modo de juego
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

    // Añadir etiquetas para identificar los tipos de entidades
    this.stoneEntity.addTag("stone");
    this.blueBirdEntity.addTag("bird").addTag("blue");
    this.greenBirdEntity.addTag("bird").addTag("green");
    this.leftTreeEntity.addTag("tree").addTag("decorative").addTag("left");
    this.rightTreeEntity.addTag("tree").addTag("decorative").addTag("right");

    // Inicializar contadores de berries en los pájaros
    this.blueBirdEntity.berryCount = 0;
    this.greenBirdEntity.berryCount = 0;
    
    // Configurar las entidades en el array de objetos del juego
    this.gameObjects = [
      this.stoneEntity,
      this.blueBirdEntity,
      this.greenBirdEntity,
      // No incluimos las berries aquí, se añadirán dinámicamente
      // No incluimos los árboles porque son decorativos y no participan en colisiones
    ];

    return this;
  }

  // Determinar qué entidad controlar según el modo de juego
  getControlledEntity(gameMode, playerType) {
    if (gameMode === "singleplayer" || gameMode === "stoneplayer") {
      return this.stoneEntity;
    } else if (gameMode === "birdplayer") {
      return playerType === "blue" ? this.blueBirdEntity : this.greenBirdEntity;
    }
    return this.stoneEntity; // Por defecto, controlar la piedra
  }

  // Crear un nuevo poop desde un pájaro
  createPoopFromBird(bird) {
    // Comprobar que la entidad sea un pájaro con berries
    if (bird.berryCount <= 0 || !bird.launchPoop) return null;

    // Lanzar poop desde el pájaro
    const poopEntity = bird.launchPoop();
    
    if (poopEntity) {
      // Añadir el poop a los arrays correspondientes
      this.poops.push(poopEntity);
      this.gameObjects.push(poopEntity);
    }
    
    return poopEntity;
  }

  // Método para generar un poop cuando el servidor lo indica o localmente
  spawnPoop(id, x, y) {
    // Crear la entidad poop
    const poopEntity = EntityFactory.createPoop(x, y, ENTITY.POOP.SIZE);
    
    // Establecer ID si se proporciona (para multijugador)
    if (id) {
      poopEntity.id = id;
    }
    
    // Añadir el poop a los arrays correspondientes
    this.poops.push(poopEntity);
    this.gameObjects.push(poopEntity);
    
    return poopEntity;
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
  generateBerryInTree(tree, id = null, specificPosition = null, spriteIndex = null) {
    // Verificar si podemos generar más berries
    const totalBerries = this.berries.length;
    const maxTotal = ENTITY.BERRY.GENERATION.MAX_TOTAL;
    const maxPerTree = ENTITY.BERRY.GENERATION.MAX_PER_TREE;

    // No generar si ya alcanzamos el máximo total
    if (totalBerries >= maxTotal) {
      return null;
    }

    // Verificar límite por árbol
    let currentTreeBerryCount;
    if (tree.hasTag("left")) {
      if (this.leftTreeBerryCount >= maxPerTree) {
        return this.generateBerryInTree(this.rightTreeEntity, id, specificPosition, spriteIndex);
      }
      currentTreeBerryCount = this.leftTreeBerryCount;
    } else {
      if (this.rightTreeBerryCount >= maxPerTree) {
        return this.generateBerryInTree(this.leftTreeEntity, id, specificPosition, spriteIndex);
      }
      currentTreeBerryCount = this.rightTreeBerryCount;
    }

    // Posición de la berry
    let berryX, berryY;
    let validPosition = false;

    if (specificPosition) {
      // Usar la posición específica proporcionada
      berryX = specificPosition.x;
      berryY = specificPosition.y;
      validPosition = true;
    } else {
      // Calcular la región circular en la mitad superior del árbol
      const treeWidth = tree.width;
      const treeHeight = tree.height;
      const centerX = tree.x + treeWidth / 2;
      const centerY = tree.y + treeHeight / 4; // Primer cuarto del árbol (mitad de la mitad superior)

      // Radio de la región circular (70% del ancho del árbol)
      const radius = (treeWidth * ENTITY.BERRY.GENERATION.SPAWN_RADIUS_FACTOR) / 2;

      // Intentos para evitar colisiones
      const maxAttempts = 15;
      let attempts = 0;

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
    }

    // Si encontramos una posición válida, crear la berry
    if (validPosition) {
      // Crear la berry
      const newBerry = EntityFactory.createBerry(
        berryX,
        berryY,
        ENTITY.BERRY.RADIO * 2,
        spriteIndex
      );

      // Establecer ID si se proporciona (para multijugador)
      if (id) {
        newBerry.id = id;
      }

      // Añadir etiqueta para identificar en qué árbol está
      newBerry.addTag("berry");
      if (tree.hasTag("left")) {
        newBerry.addTag("left-tree");
        this.leftTreeBerryCount++;
        newBerry.treePosition = "left";
      } else {
        newBerry.addTag("right-tree");
        this.rightTreeBerryCount++;
        newBerry.treePosition = "right";
      }

      // Añadir la berry a los arrays
      this.berries.push(newBerry);
      this.gameObjects.push(newBerry);

      return newBerry;
    }

    return null;
  }

  // Verifica si una posición es válida para generar una berry (sin colisiones)
  isValidBerryPosition(x, y) {
    // Verificar que esté dentro de los límites del juego
    if (
      x < 0 ||
      x > NORMALIZED_SPACE.WIDTH ||
      y < 0 ||
      y > NORMALIZED_SPACE.HEIGHT
    ) {
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

  // Actualizar los contadores de berries cuando una berry es eliminada
  updateBerryCounters() {
    this.leftTreeBerryCount = 0;
    this.rightTreeBerryCount = 0;

    for (const berry of this.berries) {
      if (!berry.markedForDeletion) {
        if (berry.hasTag("left-tree")) {
          this.leftTreeBerryCount++;
        } else if (berry.hasTag("right-tree")) {
          this.rightTreeBerryCount++;
        }
      }
    }
  }

  // Método para generar una berry cuando el servidor lo indica o localmente
  spawnBerry(id, treePosition, specificPosition = null, spriteIndex = null) {
    // Usar el árbol correspondiente
    const tree = treePosition === "left" ? this.leftTreeEntity : this.rightTreeEntity;
    return this.generateBerryInTree(tree, id, specificPosition, spriteIndex);
  }

  // Limpiar entidades marcadas para eliminación
  pruneEntities() {
    // Filtrar entidades marcadas para eliminación
    const remainingObjects = this.gameObjects.filter((obj) => {
      // Si es una BerryEntity, revisar su propiedad markedForDeletion
      if (obj instanceof BerryEntity) {
        return !obj.markedForDeletion;
      }
      // Para otras entidades, usar el método anterior
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
        // Usar la propiedad directa en lugar del componente
        return !berry.markedForDeletion;
      });

      this.berries = remainingBerries;

      // Limpiamos también los poops que hayan sido marcados para eliminación
      const remainingPoops = this.poops.filter((poop) => {
        const damageComp = poop.getComponent(DamageableComponent);
        return !(damageComp && damageComp.markedForDeletion);
      });

      this.poops = remainingPoops;
    }
  }

  // Actualizar todas las entidades
  updateEntities(deltaTime) {
    // Procesar eliminaciones primero
    this.pruneEntities();
    
    // Actualizar todos los objetos
    for (const obj of this.gameObjects) {
      obj.update(this.gameObjects, deltaTime);
    }
    
    // Actualizar temporizador de generación de berries
    this.berrySpawnElapsedTime += deltaTime;
  }
}
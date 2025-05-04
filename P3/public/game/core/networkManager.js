// Gestor de red para comunicación entre clientes
import {
  DamageableComponent,
  PhysicsComponent,
  BerryCollectableComponent,
} from "./entities/entities.js";
import { NETWORK } from "../constants.js";

export class NetworkManager {
  constructor(socket = null) {
    this.socket = socket;
    this.isConnected = false;
    this.playerType = null;
    this.gameMode = null;
    this.entityStates = {};
    this.handlers = {};

    // Si hay socket, establecer estado de conexión
    if (this.socket) {
      this.isConnected = true;
    }
  }

  // Conectarse al servidor
  connect(socket) {
    if (socket) {
      this.socket = socket;
      this.isConnected = true;
    }
    return this;
  }

  // Configurar para modo de juego específico
  configure(gameMode, playerType) {
    this.gameMode = gameMode;
    this.playerType = playerType;
    return this;
  }

  // Configurar manejadores de eventos para recepción de mensajes
  setupHandlers(entityManager, renderManager) {
    if (!this.socket || !this.isConnected) return this;

    // Creamos los manejadores de estado de entidad según el modo de juego
    if (this.gameMode === "stoneplayer") {
      // El jugador piedra recibe actualizaciones de los pájaros
      this.socket.on(NETWORK.MESSAGES.SERVER.BLUE_BIRD_UPDATED, (state) => {
        this.updateEntityFromState(entityManager.blueBirdEntity, state);
      });

      this.socket.on(NETWORK.MESSAGES.SERVER.GREEN_BIRD_UPDATED, (state) => {
        this.updateEntityFromState(entityManager.greenBirdEntity, state);
      });

      this.socket.on(NETWORK.MESSAGES.SERVER.POOP_UPDATED, (state) => {
        const poop = entityManager.poops.find((p) => p.id === state.id);
        if (poop) {
          this.updateEntityFromState(poop, state);
        }
      });
    } else if (this.gameMode === "birdplayer") {
      // El jugador pájaro recibe actualizaciones de la piedra
      this.socket.on(NETWORK.MESSAGES.SERVER.STONE_UPDATED, (state) => {
        this.updateEntityFromState(entityManager.stoneEntity, state);
      });

      this.socket.on(NETWORK.MESSAGES.SERVER.BERRY_SPAWNED, (data) => {
        const { id, treePosition, x, y, spriteIndex } = data; // Extraer x,y directamente
        const position = x && y ? { x, y } : null;

        // Generar la berry con las coordenadas recibidas
        const berry = entityManager.spawnBerry(
          id,
          treePosition,
          position,
          spriteIndex
        );

        if (berry) {
          // Crear la vista para la berry usando el mismo índice de sprite
          renderManager.createBerryView(berry);
        }
      });

      this.socket.on(NETWORK.MESSAGES.SERVER.BERRY_UPDATED, (state) => {
        let berry = entityManager.berries.find((b) => b.id === state.id);
        console.log("Recibida berry en posición:", state.x, state.y);

        // Validar que las coordenadas sean números válidos
        const isValidPosition =
          typeof state.x === "number" &&
          !isNaN(state.x) &&
          typeof state.y === "number" &&
          !isNaN(state.y);

        if (!berry && state.id && isValidPosition) {
          // Si la berry no existe pero tenemos un ID válido y posición válida, crearla
          berry = entityManager.spawnBerry(
            state.id,
            state.treePosition || "left",
            { x: state.x, y: state.y },
            state.spriteIndex
          );

          if (berry) {
            // Crear vista para la berry recién creada
            renderManager.createBerryView(berry);
          }
        }

        if (berry && isValidPosition) {
          // Solo actualizar si la posición es válida
          this.updateEntityFromState(berry, state);
          // Si está marcada para eliminación, asegurarse que la vista refleje esto
          if (state.isCollected || state.markedForDeletion) {
            const damageComp = berry.getComponent(DamageableComponent);
            if (damageComp) {
              damageComp.broken = true;
              damageComp.markedForDeletion = true;
            }
          }
        } else if (berry) {
          // Si la berry existe pero la posición es inválida, solo actualizar otros campos
          if (state.isCollected || state.markedForDeletion) {
            const damageComp = berry.getComponent(DamageableComponent);
            if (damageComp) {
              damageComp.broken = true;
              damageComp.markedForDeletion = true;
            }
          }
        }
      });
    }

    return this;
  }

  // Actualizar una entidad con el estado recibido
  updateEntityFromState(entity, state) {
    if (!entity) return;

    // Actualizar posición y velocidad solo si son números válidos
    if (typeof state.x === "number" && !isNaN(state.x)) {
      entity.x = state.x;
    }
    if (typeof state.y === "number" && !isNaN(state.y)) {
      entity.y = state.y;
    }

    // Validar velocidades
    const physicsComp = entity.getComponent(PhysicsComponent);
    if (physicsComp) {
      if (typeof state.velocityX === "number" && !isNaN(state.velocityX)) {
        physicsComp.velocityX = state.velocityX;
      }
      if (typeof state.velocityY === "number" && !isNaN(state.velocityY)) {
        physicsComp.velocityY = state.velocityY;
      }
    }

    // Actualizar salud si existe
    const damageComp = entity.getComponent(DamageableComponent);
    if (damageComp && state.health !== undefined) {
      damageComp.health = state.health;
    }

    // Actualizar propiedades específicas
    if (entity.hasTag("bird")) {
      entity.berryCount = state.berryCount;
      entity.isFlying = state.isFlying;
    } else if (entity.hasTag("stone")) {
      entity.isLaunched = state.isLaunched;
    } else if (entity.hasTag("berry")) {
      entity.isCollected = state.isCollected;
      // Actualizar también markedForDeletion si existe
      const damageComp = entity.getComponent(DamageableComponent);
      if (damageComp && state.markedForDeletion !== undefined) {
        damageComp.markedForDeletion = state.markedForDeletion;
        if (state.markedForDeletion) {
          damageComp.broken = true;
        }
      }
    } else if (entity.hasTag("poop")) {
      entity.isLanded = state.isLanded;
    }
  }

  // Métodos para obtener estados de entidades para enviar
  getBirdState(bird) {
    return {
      x: bird.x,
      y: bird.y,
      velocityX: bird.getComponent(PhysicsComponent)?.velocityX || 0,
      velocityY: bird.getComponent(PhysicsComponent)?.velocityY || 0,
      health: bird.getComponent(DamageableComponent)?.health || 0,
      berryCount: bird.berryCount || 0,
      isFlying: bird.isFlying || false,
    };
  }

  getStoneState(stone) {
    return {
      x: stone.x,
      y: stone.y,
      velocityX: stone.getComponent(PhysicsComponent)?.velocityX || 0,
      velocityY: stone.getComponent(PhysicsComponent)?.velocityY || 0,
      isLaunched: stone.isLaunched || false,
    };
  }

  getBerryState(berry) {
    return {
      id: berry.id,
      x: berry.x,
      y: berry.y,
      health: berry.getComponent(DamageableComponent)?.health || 0,
      isCollected:
        berry.getComponent(BerryCollectableComponent)?.collected || false,
      treePosition: berry.treePosition,
      spriteIndex: berry.spriteIndex,
      markedForDeletion:
        berry.getComponent(DamageableComponent)?.markedForDeletion || false,
    };
  }

  getPoopState(poop) {
    return {
      id: poop.id,
      x: poop.x,
      y: poop.y,
      velocityX: poop.getComponent(PhysicsComponent)?.velocityX || 0,
      velocityY: poop.getComponent(PhysicsComponent)?.velocityY || 0,
      health: poop.getComponent(DamageableComponent)?.health || 0,
      isLanded: poop.isLanded || false,
    };
  }

  // Enviar actualizaciones al servidor
  updateEntityStates(entityManager) {
    if (!this.socket || !this.isConnected) return;

    // Determinar qué entidades controla este cliente
    if (this.gameMode === "birdplayer") {
      // Enviar estados de los pájaros
      this.socket.emit(
        NETWORK.MESSAGES.CLIENT.UPDATE_BLUE_BIRD,
        this.getBirdState(entityManager.blueBirdEntity)
      );
      this.socket.emit(
        NETWORK.MESSAGES.CLIENT.UPDATE_GREEN_BIRD,
        this.getBirdState(entityManager.greenBirdEntity)
      );

      // Enviar estados de poops si existen
      entityManager.poops.forEach((poop) => {
        this.socket.emit(
          NETWORK.MESSAGES.CLIENT.UPDATE_POOP,
          this.getPoopState(poop)
        );
      });
    } else if (this.gameMode === "stoneplayer") {
      // Enviar estado de la piedra
      this.socket.emit(
        NETWORK.MESSAGES.CLIENT.UPDATE_STONE,
        this.getStoneState(entityManager.stoneEntity)
      );

      entityManager.berries.forEach((berry) => {
        this.socket.emit(
          NETWORK.MESSAGES.CLIENT.UPDATE_BERRY,
          this.getBerryState(berry)
        );
      });
    }
  }

  // Solicitar generación de una berry
  requestBerrySpawn(treePosition) {
    if (this.socket && this.isConnected) {
      this.socket.emit(NETWORK.MESSAGES.CLIENT.REQUEST_BERRY_SPAWN, {
        treePosition,
      });
    }
  }

  // Desconectar
  disconnect() {
    this.isConnected = false;
    // No desconectamos el socket aquí, ya que podría ser manejado externamente
  }
}

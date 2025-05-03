// Gestor de red para comunicación entre clientes
import { DamageableComponent, PhysicsComponent } from "./entities/entities.js";
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

      this.socket.on(
        NETWORK.MESSAGES.SERVER.BERRY_SPAWNED,(data) => {
          // Extraer todos los datos necesarios de la berry
          const { id, treePosition, position, spriteIndex } = data;
          
          // Generar la berry en la misma posición que se generó en el cliente piedra
          const berry = entityManager.spawnBerry(id, treePosition, position, spriteIndex);
          
          if (berry) {
            // Crear la vista para la berry usando el mismo índice de sprite
            renderManager.createBerryView(berry);
          }
        });

      this.socket.on(NETWORK.MESSAGES.SERVER.BERRY_UPDATED, (state) => {
        const berry = entityManager.berries.find((b) => b.id === state.id);
        if (berry) {
          this.updateEntityFromState(berry, state);
        }
      });
    }

    return this;
  }

  // Actualizar una entidad con el estado recibido
  updateEntityFromState(entity, state) {
    if (!entity) return;

    // Actualizar posición y velocidad
    entity.x = state.x;
    entity.y = state.y;

    const physicsComp = entity.getComponent(PhysicsComponent);
    if (physicsComp) {
      physicsComp.velocityX = state.velocityX;
      physicsComp.velocityY = state.velocityY;
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
      isCollected: berry.isCollected || false,
      treePosition: berry.treePosition,
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

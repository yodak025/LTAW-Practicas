// Clase base
import { ENTITY, NORMALIZED_SPACE } from "./constants.js";

// Enum para tipos de colisionadores
export const ColliderType = {
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
};

// Clase base para todas las entidades
export class Entity {
  constructor(x, y, width, height) {
    // Las coordenadas son normalizadas (0-16 para x, 0-9 para y)
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Propiedades comunes
    this.components = [];
    this.tags = new Set();

    // Por defecto, colisionador rectangular
    this.colliderType = ColliderType.RECTANGLE;
    this.radius = Math.min(width, height) / 2;
  }

  // Añadir un componente a la entidad
  addComponent(component) {
    component.entity = this;
    this.components.push(component);
    return component;
  }

  // Obtener un componente por su tipo
  getComponent(componentType) {
    return this.components.find((comp) => comp instanceof componentType);
  }

  // Añadir una etiqueta a la entidad
  addTag(tag) {
    this.tags.add(tag);
    return this;
  }

  // Comprobar si tiene una etiqueta
  hasTag(tag) {
    return this.tags.has(tag);
  }

  // Configurar como círculo
  setCircleCollider(radius = null) {
    this.colliderType = ColliderType.CIRCLE;
    this.radius = radius || Math.min(this.width, this.height) / 2;
    return this;
  }

  // Obtener límites (para colisiones rectangulares)
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
      centerX: this.x + this.width / 2,
      centerY: this.y + this.height / 2,
    };
  }

  // Comprobar colisión con otra entidad
  isColliding(other) {
    // Caso círculo vs círculo
    if (
      this.colliderType === ColliderType.CIRCLE &&
      other.colliderType === ColliderType.CIRCLE
    ) {
      const dx = this.x + this.width / 2 - (other.x + other.width / 2);
      const dy = this.y + this.height / 2 - (other.y + other.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.radius + other.radius;
    }

    // Caso rectángulo vs círculo
    if (
      this.colliderType === ColliderType.RECTANGLE &&
      other.colliderType === ColliderType.CIRCLE
    ) {
      return this.rectCircleCollision(this, other);
    }

    // Caso círculo vs rectángulo
    if (
      this.colliderType === ColliderType.CIRCLE &&
      other.colliderType === ColliderType.RECTANGLE
    ) {
      return this.rectCircleCollision(other, this);
    }

    // Caso rectángulo vs rectángulo (por defecto)
    const bounds = this.getBounds();
    const otherBounds = other.getBounds();

    return (
      bounds.left < otherBounds.right &&
      bounds.right > otherBounds.left &&
      bounds.top < otherBounds.bottom &&
      bounds.bottom > otherBounds.top
    );
  }

  // Implementación de colisión rectángulo-círculo
  rectCircleCollision(rect, circle) {
    const rectBounds = rect.getBounds();
    const circleCenter = {
      x: circle.x + circle.width / 2,
      y: circle.y + circle.height / 2,
    };

    // Encontrar el punto más cercano del rectángulo al centro del círculo
    const closestX = Math.max(
      rectBounds.left,
      Math.min(circleCenter.x, rectBounds.right)
    );
    const closestY = Math.max(
      rectBounds.top,
      Math.min(circleCenter.y, rectBounds.bottom)
    );

    // Calcular distancia entre el punto más cercano y el centro del círculo
    const distanceX = circleCenter.x - closestX;
    const distanceY = circleCenter.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= circle.radius * circle.radius;
  }

  // Actualización principal (llama a todos los componentes)
  update(gameObjects, deltaTime) {
    // Actualizar todos los componentes
    for (const component of this.components) {
      if (component.update) {
        component.update(gameObjects, deltaTime);
      }
    }
  }
}

// Clase para componentes
export class Component {
  constructor() {
    this.entity = null;
  }

  update(gameObjects, deltaTime) {
    // Método base para ser sobrescrito por los componentes concretos
  }
}

// Componente de colisión
export class ColliderComponent extends Component {
  constructor() {
    super();
    this.isOnGround = false;
  }

  // Resolver colisión con otra entidad
  resolveCollision(other) {
    // Obtener componente de física
    const physicsComponent = this.entity.getComponent(PhysicsComponent);

    // Si no hay propiedades de física, no hay nada que resolver
    if (!physicsComponent) return;

    // Calcular velocidad de impacto
    const impactVelocity = Math.sqrt(
      physicsComponent.velocityX * physicsComponent.velocityX +
        physicsComponent.velocityY * physicsComponent.velocityY
    );

    // Aplicar daño si la otra entidad puede recibirlo
    const damageComponent = other.getComponent(DamageableComponent);
    if (damageComponent && impactVelocity > 0) {
      const damageAmount = impactVelocity * ENTITY.PHYSICS.DAMAGE_MULTIPLIER;
      damageComponent.takeDamage(damageAmount);
    }

    // Resolución de colisión específica según el tipo de colisionador
    if (
      this.entity.colliderType === ColliderType.CIRCLE &&
      other.colliderType === ColliderType.CIRCLE
    ) {
      this.resolveCircleCollision(other);
    } else if (
      this.entity.colliderType === ColliderType.RECTANGLE &&
      other.colliderType === ColliderType.RECTANGLE
    ) {
      this.resolveRectangleCollision(other);
    } else {
      // Colisión mixta (rect-circle), usamos una resolución más simple
      this.resolveSimpleCollision(other);
    }
  }

  // Resolver colisión entre círculos
  resolveCircleCollision(other) {
    const thisCenter = {
      x: this.entity.x + this.entity.width / 2,
      y: this.entity.y + this.entity.height / 2,
    };

    const otherCenter = {
      x: other.x + other.width / 2,
      y: other.y + other.height / 2,
    };

    // Vector dirección entre centros
    const dx = thisCenter.x - otherCenter.x;
    const dy = thisCenter.y - otherCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si la distancia es cero, movemos ligeramente para evitar división por cero
    if (distance === 0) {
      this.entity.x += 0.01;
      return;
    }

    // Calcular superposición
    const overlap = this.entity.radius + other.radius - distance;

    if (overlap > 0) {
      // Mover la entidad fuera de la colisión
      const normalX = dx / distance;
      const normalY = dy / distance;

      this.entity.x += normalX * overlap;
      this.entity.y += normalY * overlap;

      // Obtener componente de física
      const physicsComponent = this.entity.getComponent(PhysicsComponent);

      // Aplicar rebote a la velocidad si existe el componente de física
      if (physicsComponent) {
        // Calcular velocidad a lo largo del vector normal
        const dot =
          physicsComponent.velocityX * normalX +
          physicsComponent.velocityY * normalY;

        // Aplicar rebote sólo en la dirección de la colisión
        physicsComponent.velocityX -=
          2 * dot * normalX * ENTITY.PHYSICS.BOUNCE_FACTOR;
        physicsComponent.velocityY -=
          2 * dot * normalY * ENTITY.PHYSICS.BOUNCE_FACTOR;

        // Marcar como en el suelo si el vector normal apunta hacia arriba
        if (normalY < -0.7) {
          this.isOnGround = true;
          physicsComponent.velocityY = 0;
        }
      }
    }
  }

  // Resolver colisión entre rectángulos
  resolveRectangleCollision(other) {
    const bounds = this.entity.getBounds();
    const otherBounds = other.getBounds();
    const physicsComponent = this.entity.getComponent(PhysicsComponent);

    // Calcular superposición en X e Y
    const overlapX = Math.min(
      bounds.right - otherBounds.left,
      otherBounds.right - bounds.left
    );
    const overlapY = Math.min(
      bounds.bottom - otherBounds.top,
      otherBounds.bottom - bounds.top
    );

    // Resolver por el eje con menor superposición
    if (overlapX < overlapY) {
      // Colisión horizontal
      if (bounds.right - otherBounds.left < otherBounds.right - bounds.left) {
        this.entity.x = otherBounds.left - this.entity.width;
      } else {
        this.entity.x = otherBounds.right;
      }
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    } else {
      // Colisión vertical
      if (bounds.bottom - otherBounds.top < otherBounds.bottom - bounds.top) {
        this.entity.y = otherBounds.top - this.entity.height;
        if (physicsComponent) {
          physicsComponent.velocityY = 0;
        }
        this.isOnGround = true;
      } else {
        this.entity.y = otherBounds.bottom;
        if (physicsComponent) {
          physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
        }
      }
    }
  }

  // Resolución simple para colisiones mixtas
  resolveSimpleCollision(other) {
    // Usar un enfoque de empuje simple basado en centros
    const thisCenter = {
      x: this.entity.x + this.entity.width / 2,
      y: this.entity.y + this.entity.height / 2,
    };

    const otherCenter = {
      x: other.x + other.width / 2,
      y: other.y + other.height / 2,
    };

    const physicsComponent = this.entity.getComponent(PhysicsComponent);

    // Dirección del empuje
    const dx = thisCenter.x - otherCenter.x;
    const dy = thisCenter.y - otherCenter.y;

    // Empujar en la dirección con mayor diferencia
    if (Math.abs(dx) > Math.abs(dy)) {
      this.entity.x += dx > 0 ? 0.1 : -0.1;
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    } else {
      if (dy > 0) {
        // Empuje hacia abajo
        this.entity.y += 0.1;
        if (physicsComponent) {
          physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
        }
      } else {
        // Empuje hacia arriba
        this.entity.y -= 0.1;
        if (physicsComponent) {
          physicsComponent.velocityY = 0;
        }
        this.isOnGround = true;
      }
    }
  }

  // Comprobar límites del mundo
  checkBounds() {
    // Si no hay propiedades de física, no hay nada que comprobar
    if (!this.entity.getComponent(PhysicsComponent)) return;

    if (this.entity.colliderType === ColliderType.CIRCLE) {
      this.checkCircleBounds();
    } else {
      this.checkRectangleBounds();
    }
  }

  // Comprobar límites para un círculo
  checkCircleBounds() {
    const center = {
      x: this.entity.x + this.entity.width / 2,
      y: this.entity.y + this.entity.height / 2,
    };

    const physicsComponent = this.entity.getComponent(PhysicsComponent);

    // Comprobar límites horizontales
    if (center.x - this.entity.radius < 0) {
      this.entity.x = -this.entity.width / 2 + this.entity.radius;
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    } else if (center.x + this.entity.radius > NORMALIZED_SPACE.WIDTH) {
      this.entity.x =
        NORMALIZED_SPACE.WIDTH - this.entity.width / 2 - this.entity.radius;
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    }

    // Comprobar límites verticales
    if (center.y - this.entity.radius < 0) {
      this.entity.y = -this.entity.height / 2 + this.entity.radius;
      if (physicsComponent) {
        physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    } else if (center.y + this.entity.radius > NORMALIZED_SPACE.HEIGHT - 0.9) {
      this.entity.y =
        NORMALIZED_SPACE.HEIGHT -
        0.9 -
        this.entity.height / 2 -
        this.entity.radius;
      if (physicsComponent) {
        // Solo aplicar rebote si la velocidad es significativa
        if (Math.abs(physicsComponent.velocityY) > ENTITY.VELOCITY_THRESHOLD) {
          physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
        } else {
          // Si la velocidad es muy baja, detenerla completamente
          physicsComponent.velocityY = 0;
        }
      }
      this.isOnGround = true;
    }
  }

  // Comprobar límites para un rectángulo
  checkRectangleBounds() {
    const bounds = this.entity.getBounds();
    const physicsComponent = this.entity.getComponent(PhysicsComponent);

    // Verificar límites en el espacio normalizado
    if (bounds.left < 0) {
      this.entity.x = 0;
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    }
    if (bounds.right > NORMALIZED_SPACE.WIDTH) {
      this.entity.x = NORMALIZED_SPACE.WIDTH - this.entity.width;
      if (physicsComponent) {
        physicsComponent.velocityX *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    }
    if (bounds.top < 0) {
      this.entity.y = 0;
      if (physicsComponent) {
        physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
    }
    if (bounds.bottom > NORMALIZED_SPACE.HEIGHT - 0.9) {
      this.entity.y = NORMALIZED_SPACE.HEIGHT - this.entity.height - 0.9;
      if (physicsComponent) {
        physicsComponent.velocityY *= ENTITY.PHYSICS.BOUNCE_FACTOR;
      }
      this.isOnGround = true;
    }
  }

  update(gameObjects, deltaTime) {
    const wasOnGround = this.isOnGround; // Guardar el estado anterior
    this.isOnGround = false;
    this.checkBounds();

    // Comprobar colisiones con otros objetos
    for (const obj of gameObjects) {
      if (obj !== this.entity && this.entity.isColliding(obj)) {
        this.resolveCollision(obj);
      }
    }

    // Si estaba en el suelo y ya no tiene velocidad vertical, mantener isOnGround
    const physicsComponent = this.entity.getComponent(PhysicsComponent);
    if (
      wasOnGround &&
      physicsComponent &&
      Math.abs(physicsComponent.velocityY) < ENTITY.VELOCITY_THRESHOLD
    ) {
      this.isOnGround = true;
      physicsComponent.velocityY = 0; // Asegurar que no haya movimiento vertical
    }
  }
}

// Componente para objetos que pueden recibir daño
export class DamageableComponent extends Component {
  constructor(health = ENTITY.BIRD.DEFAULT_HEALTH) {
    super();
    this.health = health;
    this.broken = false;
    this.markedForDeletion = false;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.broken = true;
      this.markedForDeletion = true;
    }
  }

  update() {
    if (this.broken && !this.markedForDeletion) {
      this.markedForDeletion = true;
    }
  }
}

// Componente de física y movimiento
export class PhysicsComponent extends Component {
  constructor(options = {}) {
    super();
    this.velocityX = options.velocityX || 0;
    this.velocityY = options.velocityY || 0;
    this.friction = options.friction || ENTITY.PHYSICS.FRICTION;
    this.gravity = options.gravity || 0;
  }

  update(gameObjects, deltaTime) {
    const collider = this.entity.getComponent(ColliderComponent);

    // Aplicar gravedad si está configurada y la entidad no está en el suelo
    if (this.gravity !== 0 && !(collider && collider.isOnGround)) {
      this.velocityY += this.gravity * deltaTime;
    }

    // Aplicar fricción si está en el suelo
    if (collider && collider.isOnGround) {
      this.velocityX *= Math.pow(this.friction, deltaTime * 60);

      // Si la velocidad es muy pequeña, detenerla
      if (Math.abs(this.velocityX) < ENTITY.VELOCITY_THRESHOLD) {
        this.velocityX = 0;
      }
    }

    // Actualizar posición
    this.entity.x += this.velocityX * deltaTime;
    this.entity.y += this.velocityY * deltaTime;
  }
}

// Componente específico para berries
export class BerryCollectableComponent extends Component {
  constructor() {
    super();
    this.collected = false;
  }

  update(gameObjects, deltaTime) {
    // Si ya fue recolectada, no hacer nada
    if (this.collected) return;

    // Verificar colisiones con pájaros
    for (const obj of gameObjects) {
      // Solo interactuar con pájaros
      if (!(obj instanceof BirdEntity) || !this.entity.isColliding(obj))
        continue;

      // Marcar como recolectada
      this.collected = true;

      // Incrementar contador de berries en el pájaro
      if (!obj.berryCount) obj.berryCount = 0;
      obj.berryCount++;

      // Marcar la entidad para eliminación
      const damageComp = this.entity.getComponent(DamageableComponent);
      if (damageComp) {
        damageComp.broken = true;
        damageComp.markedForDeletion = true;
      }

      break;
    }
  }
}

// Fábrica de entidades para simplificar la creación
export class EntityFactory {
  // Crear una roca (con física y colisiones)
  static createRock(x, y, size = ENTITY.DEFAULT_SIZE) {
    // Usar RockEntity directamente en lugar de configurar Entity
    return new RockEntity(x, y, size, size);
  }

  // Crear un pájaro (con física, colisiones y daño)
  static createBird(
    x,
    y,
    size = ENTITY.DEFAULT_SIZE,
    health = ENTITY.BIRD.DEFAULT_HEALTH
  ) {
    // Usar BirdEntity directamente en lugar de configurar Entity
    return new BirdEntity(x, y, size, size, health);
  }

  // Crear una plataforma estática
  static createPlatform(x, y, width, height) {
    // Usar StaticEntity directamente en lugar de configurar Entity
    return new StaticEntity(x, y, width, height);
  }

  // Crear una berry (rompible por pájaros, sin gravedad)
  static createBerry(x, y, size = ENTITY.DEFAULT_SIZE) {
    return new BerryEntity(x, y, size);
  }
}

// Estas clases se mantienen para compatibilidad con el código existente
export class StaticEntity extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.addComponent(new ColliderComponent());
  }
}

export class BreakableEntity extends Entity {
  constructor(x, y, width, height, health = ENTITY.BIRD.DEFAULT_HEALTH) {
    super(x, y, width, height);
    this.addComponent(new ColliderComponent());
    const damageComp = this.addComponent(new DamageableComponent(health));

    // Propiedades para compatibilidad
    this.health = health;
    this.broken = false;
    this.markedForDeletion = false;

    // Proxy para mantener sincronizadas las propiedades
    Object.defineProperty(this, "broken", {
      get: () => damageComp.broken,
      set: (value) => {
        damageComp.broken = value;
      },
    });

    Object.defineProperty(this, "markedForDeletion", {
      get: () => damageComp.markedForDeletion,
      set: (value) => {
        damageComp.markedForDeletion = value;
      },
    });
  }

  takeDamage(amount) {
    const damageComp = this.getComponent(DamageableComponent);
    damageComp.takeDamage(amount);
    this.health = damageComp.health;
  }
}

export class PlayableEntity extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.addComponent(new ColliderComponent());
    const physicsComp = this.addComponent(new PhysicsComponent());

    // Propiedades para compatibilidad
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = ENTITY.PHYSICS.FRICTION;

    // Proxy para mantener sincronizadas las propiedades
    Object.defineProperty(this, "velocityX", {
      get: () => physicsComp.velocityX,
      set: (value) => {
        physicsComp.velocityX = value;
      },
    });

    Object.defineProperty(this, "velocityY", {
      get: () => physicsComp.velocityY,
      set: (value) => {
        physicsComp.velocityY = value;
      },
    });
  }
}

export class RockEntity extends PlayableEntity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    const physicsComp = this.getComponent(PhysicsComponent);
    physicsComp.gravity = ENTITY.ROCK.GRAVITY;

    // Configurar como círculo para colisiones físicamente más realistas
    this.setCircleCollider();

    // Propiedad para compatibilidad
    this.gravity = ENTITY.ROCK.GRAVITY;
  }
}

export class BirdEntity extends Entity {
  constructor(x, y, width, height, health = ENTITY.BIRD.DEFAULT_HEALTH) {
    super(x, y, width, height);
    this.addComponent(new ColliderComponent());
    this.addComponent(new DamageableComponent(health));
    const physicsComp = this.addComponent(new PhysicsComponent());

    // Propiedades para compatibilidad
    this.health = health;
    this.broken = false;
    this.markedForDeletion = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = ENTITY.PHYSICS.FRICTION;

    // Proxy para propiedades de daño
    const damageComp = this.getComponent(DamageableComponent);
    Object.defineProperty(this, "broken", {
      get: () => damageComp.broken,
      set: (value) => {
        damageComp.broken = value;
      },
    });

    Object.defineProperty(this, "markedForDeletion", {
      get: () => damageComp.markedForDeletion,
      set: (value) => {
        damageComp.markedForDeletion = value;
      },
    });

    // Proxy para propiedades de física
    Object.defineProperty(this, "velocityX", {
      get: () => physicsComp.velocityX,
      set: (value) => {
        physicsComp.velocityX = value;
      },
    });

    Object.defineProperty(this, "velocityY", {
      get: () => physicsComp.velocityY,
      set: (value) => {
        physicsComp.velocityY = value;
      },
    });
  }

  takeDamage(amount) {
    const damageComp = this.getComponent(DamageableComponent);
    damageComp.takeDamage(amount);
    this.health = damageComp.health;
  }
}

export class BerryEntity extends BreakableEntity {
  constructor(x, y, size = ENTITY.DEFAULT_SIZE) {
    super(x, y, size, size, ENTITY.BERRY.DEFAULT_HEALTH);

    // Añadir componente específico para berries
    this.addComponent(new BerryCollectableComponent());

    // Las berries no se ven afectadas por la gravedad
    const physicsComp = this.addComponent(
      new PhysicsComponent({
        gravity: 0, // Sin gravedad
      })
    );

    // Inicializar contador de berries (utilizado por los pájaros)
    this.berryCount = 0;

    // Configurar como círculo para colisiones más precisas
    this.setCircleCollider();
  }
}

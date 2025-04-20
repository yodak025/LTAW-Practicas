// Clase base
export class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    isColliding(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        return bounds.left < otherBounds.right &&
               bounds.right > otherBounds.left &&
               bounds.top < otherBounds.bottom &&
               bounds.bottom > otherBounds.top;
    }

    update(gameObjects, deltaTime) {
        // Método base para ser sobrescrito
    }
}

// Clase base para entidades con colisiones
export class CollidingEntity extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.isOnGround = false;
    }

    resolveCollision(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        // Calcular la velocidad del impacto si existe
        const impactVelocity = this.velocityX !== undefined && this.velocityY !== undefined ?
            Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY) : 0;

        // Si el objeto tiene el método takeDamage, aplicar daño basado en la velocidad
        if (other.takeDamage && impactVelocity > 0) {
            const damageAmount = impactVelocity * 1;
            other.takeDamage(damageAmount);
        }

        const overlapX = Math.min(bounds.right - otherBounds.left, otherBounds.right - bounds.left);
        const overlapY = Math.min(bounds.bottom - otherBounds.top, otherBounds.bottom - bounds.top);

        if (overlapX < overlapY) {
            if (bounds.right - otherBounds.left < otherBounds.right - bounds.left) {
                this.x = otherBounds.left - this.width;
            } else {
                this.x = otherBounds.right;
            }
            if (this.velocityX !== undefined) this.velocityX *= -0.5;
        } else {
            if (bounds.bottom - otherBounds.top < otherBounds.bottom - bounds.top) {
                this.y = otherBounds.top - this.height;
                if (this.velocityY !== undefined) this.velocityY = 0;
                this.isOnGround = true;
            } else {
                this.y = otherBounds.bottom;
                if (this.velocityY !== undefined) this.velocityY *= -0.5;
            }
        }
    }

    checkBounds() {
        const canvas = document.getElementById('canvas');
        const bounds = this.getBounds();
        
        if (bounds.left < 0) {
            this.x = 0;
            if (this.velocityX !== undefined) this.velocityX *= -0.5;
        }
        if (bounds.right > canvas.width) {
            this.x = canvas.width - this.width;
            if (this.velocityX !== undefined) this.velocityX *= -0.5;
        }
        if (bounds.top < 0) {
            this.y = 0;
            if (this.velocityY !== undefined) this.velocityY *= -0.5;
        }
        if (bounds.bottom > canvas.height) {
            this.y = canvas.height - this.height;
            if (this.velocityY !== undefined) this.velocityY *= -0.5;
            this.isOnGround = true;
        }
    }

    update(gameObjects, deltaTime) {
        this.checkBounds();
        for (const obj of gameObjects) {
            if (obj !== this && this.isColliding(obj)) {
                this.resolveCollision(obj);
            }
        }
    }
}

// Clase para crear mixins
const applyMixins = (derivedCtor, constructors) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== 'constructor') {
                Object.defineProperty(
                    derivedCtor.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
                );
            }
        });
    });
};

// Mixin para comportamiento rompible
class BreakableMixin {
    initBreakable(health = 100) {
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
}

// Mixin para comportamiento controlable
class PlayableMixin {
    initPlayable() {
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = 0.95;
    }

    updatePlayable() {
        // Aplicar fricción si está en el suelo
        if (this.isOnGround) {
            this.velocityX *= this.friction;
        }

        // Si la velocidad es muy pequeña, detenerla
        if (Math.abs(this.velocityX) < 0.01) {
            this.velocityX = 0;
        }

        // Actualizar posición
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}

// Clase para entidades controlables
export class PlayableEntity extends CollidingEntity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = 0.95;
    }

    update(gameObjects, deltaTime) {
        // Aplicar fricción si está en el suelo
        if (this.isOnGround) {
            this.velocityX *= Math.pow(this.friction, deltaTime * 60); // Ajustar fricción al deltaTime
        }

        // Si la velocidad es muy pequeña, detenerla
        if (Math.abs(this.velocityX) < 0.01) {
            this.velocityX = 0;
        }

        // Actualizar posición con deltaTime
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Resetear el estado de contacto con el suelo
        this.isOnGround = false;

        // Llamar a la actualización de colisiones del padre
        super.update(gameObjects, deltaTime);
    }
}

// Clase para entidades afectadas por la gravedad
export class GravityEntity extends CollidingEntity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.velocityY = 0;
        this.gravity = 980; // Ajustado para deltaTime (unidades/segundo²)
    }

    update(gameObjects, deltaTime) {
        // Aplicar gravedad con deltaTime
        this.velocityY += this.gravity * deltaTime;
        
        // Actualizar posición vertical con deltaTime
        this.y += this.velocityY * deltaTime;

        // Resetear el estado de contacto con el suelo
        this.isOnGround = false;

        // Llamar a la actualización de colisiones del padre
        super.update(gameObjects, deltaTime);
    }
}

// Clase base para entidades estáticas
export class StaticEntity extends CollidingEntity {
    update() {
        // Las entidades estáticas no se actualizan
    }
}

// Clase para entidades rompibles
export class BreakableEntity extends CollidingEntity {
    constructor(x, y, width, height, health = 100) {
        super(x, y, width, height);
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

    update(gameObjects, deltaTime) {
        if (this.broken && !this.markedForDeletion) {
            this.markedForDeletion = true;
        }
        super.update(gameObjects, deltaTime);
    }
}

// Clase para la roca (combina gravedad y control)
export class RockEntity extends PlayableEntity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.gravity = 9000; // Ajustado para deltaTime (unidades/segundo²)
    }

    update(gameObjects, deltaTime) {
        // Aplicar gravedad con deltaTime
        this.velocityY += this.gravity * deltaTime;
        
        // Llamar a la actualización de PlayableEntity
        super.update(gameObjects, deltaTime);
    }
}

// Clase para los pájaros usando mixins
export class BirdEntity extends CollidingEntity {
    constructor(x, y, width, height, health = 100) {
        super(x, y, width, height);
        this.initBreakable(health);
        this.initPlayable();
    }

    update(gameObjects, deltaTime) {
        // Actualizar comportamiento controlable
        this.updatePlayable();
        
        // Comprobar si está roto
        if (this.broken && !this.markedForDeletion) {
            this.markedForDeletion = true;
        }

        // Actualizar colisiones
        super.update(gameObjects, deltaTime);
    }
}

// Aplicar mixins a BirdEntity
applyMixins(BirdEntity, [BreakableMixin, PlayableMixin]);
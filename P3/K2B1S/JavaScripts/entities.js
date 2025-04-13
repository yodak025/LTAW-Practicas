// Clase base para todas las entidades
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

    update(gameObjects) {
        // Método base para ser sobrescrito
    }
}

// Clase para entidades afectadas por la física
export class DynamicEntity extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.velocityY = 0;
        this.velocityX = 0;
        this.gravity = 0.5;
        this.friction = 0.95; // Factor de fricción (1 = sin fricción, 0 = fricción máxima)
        this.isOnGround = false; // Para detectar si está en contacto con una superficie
    }

    resolveCollision(other) {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        // Calcular la velocidad del impacto
        const impactVelocity = Math.sqrt(
            this.velocityX * this.velocityX + 
            this.velocityY * this.velocityY
        );

        // Si el objeto es rompible, aplicar daño basado en la velocidad
        if (other instanceof BreakableEntity) {
            const damageAmount = impactVelocity * 1; // Factor de daño
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
            this.velocityX *= -0.5;
        } else {
            if (bounds.bottom - otherBounds.top < otherBounds.bottom - bounds.top) {
                this.y = otherBounds.top - this.height;
                this.velocityY = 0;
                this.isOnGround = true; // Marcar que está en contacto con el suelo
            } else {
                this.y = otherBounds.bottom;
                this.velocityY *= -0.5;
            }
        }
    }

    update(gameObjects) {
        // Aplicar gravedad
        this.velocityY += this.gravity;
        
        // Aplicar fricción si está en el suelo
        if (this.isOnGround) {
            this.velocityX *= this.friction;
        }

        // Si la velocidad es muy pequeña, detenerla
        if (Math.abs(this.velocityX) < 0.01) {
            this.velocityX = 0;
        }
        
        // Actualizar posición
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Resetear el estado de contacto con el suelo
        this.isOnGround = false;

        // Colisiones con los bordes del canvas
        const canvas = document.getElementById('canvas');
        const bounds = this.getBounds();
        
        if (bounds.left < 0) {
            this.x = 0;
            this.velocityX *= -0.5;
        }
        if (bounds.right > canvas.width) {
            this.x = canvas.width - this.width;
            this.velocityX *= -0.5;
        }
        if (bounds.top < 0) {
            this.y = 0;
            this.velocityY *= -0.5;
        }
        if (bounds.bottom > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY *= -0.5;
            this.isOnGround = true; // También aplicar fricción en el suelo del canvas
        }

        // Comprobar colisiones con otros objetos
        for (const obj of gameObjects) {
            if (obj !== this && this.isColliding(obj)) {
                this.resolveCollision(obj);
            }
        }
    }
}

// Clase base para entidades estáticas
export class StaticEntity extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    update(gameObjects) {
        // Las entidades estáticas no se actualizan
    }
}

// Clase para entidades estáticas rompibles
export class BreakableEntity extends StaticEntity {
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

    update(gameObjects) {
        // Si está roto, será eliminado en el próximo frame
        if (this.broken && !this.markedForDeletion) {
            this.markedForDeletion = true;
        }
    }
}
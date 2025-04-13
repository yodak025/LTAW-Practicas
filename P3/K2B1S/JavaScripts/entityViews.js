// Clase base para la visualización de entidades
export class EntityView {
    constructor(entity) {
        this.entity = entity;
        this.ctx = document.getElementById('canvas').getContext('2d');
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawCollider(color = 'rgba(255, 0, 0, 0.3)') {
        this.drawRect(
            this.entity.x,
            this.entity.y,
            this.entity.width,
            this.entity.height,
            color
        );
    }
}

// Clase para entidades con sprite estático
export class StaticSpriteEntityView extends EntityView {
    constructor(entity, sprite) {
        super(entity);
        this.sprite = sprite;
    }

    drawSprite() {
        this.ctx.drawImage(
            this.sprite,
            this.entity.x,
            this.entity.y,
            this.entity.width,
            this.entity.height
        );
    }
}

// Clase para entidades con sprites animados
export class AnimatedEntityView extends StaticSpriteEntityView {
    constructor(entity, sprites) {
        super(entity, sprites[0]);
        this.sprites = sprites;
        this.currentSpriteIndex = 0;
    }

    drawSprite() {
        this.ctx.drawImage(
            this.sprites[this.currentSpriteIndex],
            this.entity.x,
            this.entity.y,
            this.entity.width,
            this.entity.height
        );
    }

    nextFrame() {
        this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.sprites.length;
    }
}
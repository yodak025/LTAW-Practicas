// Clase base para la visualización de entidades
import { NORMALIZED_SPACE } from './constants.js';

export class EntityView {
    constructor(entity) {
        this.entity = entity;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Convertir coordenadas normalizadas a coordenadas de pantalla
    normalizedToScreen(x, y, width, height) {
        const scaleX = this.canvas.width / NORMALIZED_SPACE.WIDTH;
        const scaleY = this.canvas.height / NORMALIZED_SPACE.HEIGHT;
        
        return {
            x: x * scaleX,
            y: y * scaleY,
            width: width * scaleX,
            height: height * scaleY
        };
    }

    drawRect(x, y, width, height, color) {
        const screen = this.normalizedToScreen(x, y, width, height);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
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
        const screen = this.normalizedToScreen(
            this.entity.x,
            this.entity.y,
            this.entity.width,
            this.entity.height
        );
        
        this.ctx.drawImage(
            this.sprite,
            screen.x,
            screen.y,
            screen.width,
            screen.height
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
        const screen = this.normalizedToScreen(
            this.entity.x,
            this.entity.y,
            this.entity.width,
            this.entity.height
        );
        
        this.ctx.drawImage(
            this.sprites[this.currentSpriteIndex],
            screen.x,
            screen.y,
            screen.width,
            screen.height
        );
    }

    nextFrame() {
        this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.sprites.length;
    }
}
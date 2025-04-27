// Clase base para la visualización de entidades
import { ENTITY, NORMALIZED_SPACE, UI } from "./constants.js";

export class EntityView {
  constructor(entity) {
    this.entity = entity;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  // Convertir coordenadas normalizadas a coordenadas de pantalla
  normalizedToScreen(x, y, width, height) {
    const scaleX = this.canvas.width / NORMALIZED_SPACE.WIDTH;
    const scaleY = this.canvas.height / NORMALIZED_SPACE.HEIGHT;

    return {
      x: x * scaleX,
      y: y * scaleY,
      width: width * scaleX,
      height: height * scaleY,
    };
  }

  drawRect(x, y, width, height, color) {
    const screen = this.normalizedToScreen(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
  }

  drawCollider(color = "rgba(255, 0, 0, 0.3)") {
    this.drawRect(
      this.entity.x,
      this.entity.y,
      this.entity.width,
      this.entity.height,
      color
    );
  }

  // Dibujar barra de vida sobre la entidad
  drawHealthBar() {
    // Verificar si la entidad tiene atributo de salud
    if (this.entity.health === undefined) {
      console.error(
        "Intento de dibujar barra de vida en entidad sin atributo health"
      );
      return;
    }

    // Calcular dimensiones de la barra de vida
    const barWidth = this.entity.width;
    const barHeight = this.entity.height * 0.1; // 10% de la altura de la entidad
    const barY = this.entity.y - barHeight * 1.5; // Posición justo encima de la entidad

    // Dibujar fondo de la barra (gris oscuro)
    this.drawRect(
      this.entity.x,
      barY,
      barWidth,
      barHeight,
      "rgba(50, 50, 50, 0.7)"
    );

    // Calcular la fracción de vida restante (entre 0 y 1)
    const healthFraction = Math.max(
      0,
      Math.min(1, this.entity.health / ENTITY.BIRD.DEFAULT_HEALTH)
    );

    // Calcular color basado en la salud (va de rojo a verde según la vida)
    const red = Math.floor(
      UI.COLLIDER_COLORS.HEALTH_BASE_RED * (1 - healthFraction)
    );
    const green = Math.floor(
      UI.COLLIDER_COLORS.HEALTH_BASE_GREEN * healthFraction
    );
    const healthColor = `rgba(${red}, ${green}, 0, 1`;

    // Dibujar barra de vida proporcional a la salud actual
    this.drawRect(
      this.entity.x,
      barY,
      barWidth * healthFraction,
      barHeight,
      healthColor
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
    this.currentSpriteIndex =
      (this.currentSpriteIndex + 1) % this.sprites.length;
  }
}

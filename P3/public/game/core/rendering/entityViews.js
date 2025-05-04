// Clase base para la visualización de entidades
import { ENTITY, NORMALIZED_SPACE, UI } from "../../constants.js";
import { DamageableComponent, ColliderType, PoopComponent } from "../entities/entities.js"

export class EntityView {
  constructor(entity, options = {}) {
    this.entity = entity;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    // Opciones para el renderizado visual
    this.visualWidth = options.visualWidth || entity.width;
    this.visualHeight = options.visualHeight || entity.height;
    
    // Desplazamiento del sprite respecto al centro del colisionador
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    
    // Factor de escala visual (para hacer sprites más grandes o pequeños)
    // Ahora soporta escala diferente en X e Y, o una escala única para ambas dimensiones
    if (typeof options.scale === 'object') {
      this.scaleX = options.scale.x || 1.0;
      this.scaleY = options.scale.y || 1.0;
    } else {
      this.scaleX = options.scale || 1.0;
      this.scaleY = options.scale || 1.0;
    }
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

  // Dibujar un rectángulo en coordenadas normalizadas
  drawRect(x, y, width, height, color) {
    const screen = this.normalizedToScreen(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
  }

  // Calcular la posición visual basada en la posición del colisionador y los offsets
  getVisualPosition() {
    // Centro del colisionador
    const centerX = this.entity.x + this.entity.width / 2;
    const centerY = this.entity.y + this.entity.height / 2;
    
    // Posición visual con offset desde el centro, ahora usando escala X e Y diferentes
    return {
      x: centerX - (this.visualWidth * this.scaleX) / 2 + this.offsetX,
      y: centerY - (this.visualHeight * this.scaleY) / 2 + this.offsetY,
      width: this.visualWidth * this.scaleX,
      height: this.visualHeight * this.scaleY
    };
  }

  // Dibujar el colisionador de la entidad (para depuración)
  drawCollider(color = "rgba(255, 0, 0, 0.3)") {
    // Determinar el tipo de colisionador y dibujar adecuadamente
    if (this.entity.colliderType === ColliderType.CIRCLE) {
      this.drawCircleCollider(color);
    } else {
      this.drawRectCollider(color);
    }
  }

  // Dibujar colisionador rectangular
  drawRectCollider(color) {
    this.drawRect(
      this.entity.x,
      this.entity.y,
      this.entity.width,
      this.entity.height,
      color
    );
  }

  // Dibujar colisionador circular
  drawCircleCollider(color) {
    const centerX = this.entity.x + this.entity.width / 2;
    const centerY = this.entity.y + this.entity.height / 2;
    
    // Convertir a coordenadas de pantalla
    const screen = this.normalizedToScreen(
      centerX - this.entity.radius,
      centerY - this.entity.radius,
      this.entity.radius * 2,
      this.entity.radius * 2
    );
    
    // Dibujar círculo
    this.ctx.beginPath();
    this.ctx.arc(
      screen.x + screen.width / 2,
      screen.y + screen.height / 2,
      screen.width / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // Dibujar barra de vida sobre la entidad
  drawHealthBar() {
    // Obtener el componente de daño si existe
    const damageComp = this.entity.getComponent ? this.entity.getComponent(DamageableComponent) : null;
    const health = damageComp ? damageComp.health : this.entity.health;
    
    // Verificar si la entidad tiene atributo de salud
    if (health === undefined) {
      console.warn("Intento de dibujar barra de vida en entidad sin atributo health");
      return;
    }

    // Usar la posición y tamaño visual para la barra de vida
    const visualPos = this.getVisualPosition();
    
    // Calcular dimensiones de la barra de vida
    const barWidth = visualPos.width;
    const barHeight = visualPos.height * 0.1; // 10% de la altura visual
    const barY = visualPos.y - barHeight * 1.5; // Posición justo encima de la entidad visual

    // Dibujar fondo de la barra (gris oscuro)
    this.drawRect(
      visualPos.x,
      barY,
      barWidth,
      barHeight,
      "rgba(50, 50, 50, 0.7)"
    );

    // Determinar la vida máxima según el tipo de entidad
    let maxHealth = ENTITY.BIRD.DEFAULT_HEALTH; // Por defecto para aves
    if (this.entity.hasTag && this.entity.hasTag("stone")) {
      maxHealth = ENTITY.STONE.DEFAULT_HEALTH; // Uso específico para la piedra
    }

    // Calcular la fracción de vida restante (entre 0 y 1)
    const healthFraction = Math.max(
      0,
      Math.min(1, health / maxHealth)
    );

    // Calcular color basado en la salud (va de rojo a verde según la vida)
    const red = Math.floor(
      UI.COLLIDER_COLORS.HEALTH_BASE_RED * (1 - healthFraction)
    );
    const green = Math.floor(
      UI.COLLIDER_COLORS.HEALTH_BASE_GREEN * healthFraction
    );
    const healthColor = `rgba(${red}, ${green}, 0, 1)`;

    // Dibujar barra de vida proporcional a la salud actual
    this.drawRect(
      visualPos.x,
      barY,
      barWidth * healthFraction,
      barHeight,
      healthColor
    );
  }

  // Dibujar contador de berries a la izquierda de la barra de vida
  drawBerryCounter() {
    // Verificar si la entidad tiene un contador de berries
    if (this.entity.berryCount === undefined) return;

    // Usar la posición y tamaño visual para el contador
    const visualPos = this.getVisualPosition();
    
    // Calcular dimensiones y posición similar a la barra de vida
    const barHeight = visualPos.height * 0.05; // 10% de la altura visual
    const barY = visualPos.y - barHeight * 1.5; // Posición justo encima de la entidad
    
    // Posición para el texto (a la izquierda de donde estaría la barra de vida)
    const textX = visualPos.x - 0.1; // Un poco a la izquierda de la barra
    const textY = barY + barHeight * 0.75; // Centrado verticalmente
    
    // Convertir a coordenadas de pantalla
    const screen = this.normalizedToScreen(textX, textY, 0, 0);
    
    // Configurar estilo del texto
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillStyle = "rgba(220, 20, 60, 0.8)"; // Color rojo frambuesa
    this.ctx.textAlign = "right";
    
    // Dibujar el contador
    this.ctx.fillText(`${this.entity.berryCount}×`, screen.x, screen.y);
  }
}

// Clase para entidades con sprite estático
export class StaticSpriteEntityView extends EntityView {
  constructor(entity, sprite, options = {}) {
    super(entity, options);
    this.sprite = sprite;
    this.circular = options.circular || (entity.colliderType === ColliderType.CIRCLE);
  }

  drawSprite() {
    // Determinar si el sprite debe ser circular visualmente
    if (this.circular) {
      this.drawCircularSprite();
    } else {
      this.drawRectangularSprite();
    }
  }

  // Dibujar sprite rectangular
  drawRectangularSprite() {
    const visualPos = this.getVisualPosition();
    
    // Convertir a coordenadas de pantalla
    const screen = this.normalizedToScreen(
      visualPos.x,
      visualPos.y,
      visualPos.width,
      visualPos.height
    );

    this.ctx.drawImage(
      this.sprite,
      screen.x,
      screen.y,
      screen.width,
      screen.height
    );
  }

  // Dibujar sprite circular
  drawCircularSprite() {
    const visualPos = this.getVisualPosition();
    
    // Convertir a coordenadas de pantalla
    const screen = this.normalizedToScreen(
      visualPos.x,
      visualPos.y,
      visualPos.width,
      visualPos.height
    );
    
    // Guardar el contexto actual
    this.ctx.save();
    
    // Crear un círculo de recorte
    this.ctx.beginPath();
    this.ctx.arc(
      screen.x + screen.width / 2,
      screen.y + screen.height / 2,
      screen.width / 2,
      0,
      Math.PI * 2
    );
    this.ctx.clip();
    
    // Dibujar la imagen dentro del círculo
    this.ctx.drawImage(
      this.sprite,
      screen.x,
      screen.y,
      screen.width,
      screen.height
    );
    
    // Restaurar el contexto
    this.ctx.restore();
  }
}

// Clase para entidades con sprites animados
export class AnimatedEntityView extends StaticSpriteEntityView {
  constructor(entity, sprites, options = {}) {
    super(entity, sprites[0], options);
    this.sprites = sprites;
    this.currentSpriteIndex = 0;
  }

  drawSprite() {
    // Actualizar el sprite actual antes de dibujar
    this.sprite = this.sprites[this.currentSpriteIndex];
    
    // Usar el método de la clase padre para dibujar
    super.drawSprite();
  }

  nextFrame() {
    this.currentSpriteIndex =
      (this.currentSpriteIndex + 1) % this.sprites.length;
  }
}

// Clase para entidades animadas que se invierten en X según la dirección del movimiento
export class DirectionalAnimatedEntityView extends AnimatedEntityView {
  constructor(entity, sprites, options = {}) {
    super(entity, sprites, options);
    
    // Dirección inicial que está mirando el sprite
    // true = mirando a la derecha, false = mirando a la izquierda
    this.facingRight = options.facingRight !== undefined ? options.facingRight : true;
    
    // Guardar la orientación inicial como referencia
    this.initialFacingRight = this.facingRight;
    
    // Última dirección conocida (para detectar cambios)
    this.lastDirectionX = 0;
  }

  drawSprite() {
    // Verificar cambio de dirección basado en la velocidad
    if (this.entity.velocityX !== 0) {
      const movingRight = this.entity.velocityX > 0;
      
      // Ajustar la orientación según la inicialización original
      if (this.initialFacingRight) {
        // Si inicialmente miraba a la derecha, usar la lógica normal
        this.facingRight = movingRight;
      } else {
        // Si inicialmente miraba a la izquierda, invertir la lógica
        this.facingRight = !movingRight;
      }
      
      // Guardar la última dirección no nula
      this.lastDirectionX = this.entity.velocityX;
    }

    // Actualizar el sprite actual antes de dibujar
    this.sprite = this.sprites[this.currentSpriteIndex];
    
    // Dibujar el sprite con la orientación adecuada
    const visualPos = this.getVisualPosition();
    
    // Convertir a coordenadas de pantalla
    const screen = this.normalizedToScreen(
      visualPos.x,
      visualPos.y,
      visualPos.width,
      visualPos.height
    );

    // Guardar el contexto actual
    this.ctx.save();
    
    // Si es un sprite circular, crear un círculo de recorte
    if (this.circular) {
      this.ctx.beginPath();
      this.ctx.arc(
        screen.x + screen.width / 2,
        screen.y + screen.height / 2,
        screen.width / 2,
        0,
        Math.PI * 2
      );
      this.ctx.clip();
    }
    
    // Aplicar transformación para invertir el sprite si es necesario
    if (!this.facingRight) {
      this.ctx.translate(screen.x + screen.width, screen.y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.sprite,
        0,
        0,
        screen.width,
        screen.height
      );
    } else {
      this.ctx.drawImage(
        this.sprite,
        screen.x,
        screen.y,
        screen.width,
        screen.height
      );
    }
    
    // Restaurar el contexto
    this.ctx.restore();
  }
}

// Clase específica para visualización de poop con cambio de sprite al aterrizar
export class PoopSpriteEntityView extends StaticSpriteEntityView {
  constructor(entity, fallingSprite, landedSprite, options = {}) {
    super(entity, fallingSprite, options);
    this.fallingSprite = fallingSprite;
    this.landedSprite = landedSprite;
  }

  drawSprite() {
    // Actualizamos el sprite según el estado del poop
    const poopComp = this.entity.getComponent(PoopComponent);
    
    // Si ha aterrizado, usamos el sprite de aterrizado
    if (poopComp && poopComp.isLanded) {
      this.sprite = this.landedSprite;
    } else {
      // Si está cayendo, usamos el sprite de caída
      this.sprite = this.fallingSprite;
    }
    
    // Usar el método de la clase padre para dibujar
    super.drawSprite();
  }
}

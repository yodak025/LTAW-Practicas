/**
 * @fileoverview Componente para controlar entidades mediante gestos de dibujo en dispositivos táctiles
 */
import { UI, NORMALIZED_SPACE, DOM } from '../../constants.js';
import { PhysicsComponent, BirdEntity } from '../entities/entities.js';

/**
 * @class DrawingPad
 * @description Implementa un pad de dibujo para controlar entidades mediante gestos en dispositivos táctiles
 */
export class DrawingPad {
    /**
     * @constructor
     * @param {HTMLCanvasElement} drawingPadCanvas - Elemento canvas para el pad de dibujo
     * @param {HTMLCanvasElement} gameCanvas - Canvas principal del juego
     * @param {Entity} controlEntity - Entidad a controlar con el pad
     * @param {number|Object} speedFactor - Factor de velocidad para el movimiento
     * @param {Object} options - Opciones adicionales
     * @param {string} [options.position='bottomLeft'] - Posición del pad ('bottomLeft', 'bottomRight')
     */
    constructor(drawingPadCanvas, gameCanvas, controlEntity, speedFactor, options = {}) {
        this.canvas = drawingPadCanvas;
        this.gameCanvas = gameCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.controlEntity = controlEntity;
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.isVisible = true;
        
        // Factor de velocidad personalizado
        this.speedFactor = speedFactor || { X: 30, Y: 30 };

        // Posición del drawing pad (bottomLeft o bottomRight)
        this.position = options.position || 'bottomLeft';

        // Configurar tamaño inicial
        this.resize();

        // Configurar eventos de mouse/touch
        this.setupEventListeners();

        // Lanzamiento automático al soltar
        this.autoLaunch = true;
        
        // Callback para cuando se lanza un poop (será establecido por el controlador del juego)
        this.onPoopLaunched = null;
    }    /**
     * @method screenToNormalized
     * @description Convierte coordenadas de pantalla a espacio normalizado
     * @param {number} x - Posición X en coordenadas de pantalla
     * @param {number} y - Posición Y en coordenadas de pantalla
     * @returns {Object} Coordenadas normalizadas {x, y}
     */
    screenToNormalized(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = NORMALIZED_SPACE.WIDTH / this.canvas.width;
        const scaleY = NORMALIZED_SPACE.HEIGHT / this.canvas.height;
        
        return {
            x: (x - rect.left) * scaleX,
            y: (y - rect.top) * scaleY
        };
    }    /**
     * @method resize
     * @description Redimensiona y posiciona el canvas del pad de dibujo
     */
    resize() {
        // Calcular el tamaño y posición del drawing pad
        const gameRect = this.gameCanvas.getBoundingClientRect();
        const padSize = gameRect.height * 0.5; // Tamaño cuadrado igual a 50% de la altura del canvas
        
        // Configurar el tamaño del drawing pad (cuadrado)
        this.canvas.width = padSize;
        this.canvas.height = padSize;
        
        // Posicionar según la opción especificada
        this.canvas.style.position = 'absolute';
        
        if (this.position === 'bottomRight') {
            this.canvas.style.top = `${gameRect.top + gameRect.height - padSize}px`;
            this.canvas.style.left = `${gameRect.left + gameRect.width - padSize}px`;
        } else { // 'bottomLeft' por defecto
            this.canvas.style.top = `${gameRect.top + gameRect.height - padSize}px`;
            //this.canvas.style.left = `${gameRect.left}px`;
        }
        
        // Añadir fondo semi-transparente
        this.canvas.style.backgroundColor = UI.DRAWING_PAD.BACKGROUND_COLOR;
        
        // Añadir un borde para mejor visibilidad
        this.canvas.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        this.canvas.style.zIndex = '10'; // Asegurar que esté por encima del canvas del juego
        
        // Añadir esquinas redondeadas para mejorar estética
        this.canvas.style.borderRadius = '10px';
    }    /**
     * @method setupEventListeners
     * @description Configura los event listeners para mouse, touch y teclado
     */
    setupEventListeners() {
        // Eventos de ratón
        this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
        this.canvas.addEventListener('mouseout', this.handleEnd.bind(this));

        // Eventos táctiles
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleEnd.bind(this));

        // Evento para tecla espacio (poop)
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Evento de resize
        window.addEventListener('resize', this.resize.bind(this));
    }
    
    // Manejar eventos de teclado (espacio para lanzar poop)
    handleKeyDown(e) {
        // Verificar si es la tecla espacio
        if (e.key === DOM.CONTROLS.POOP_KEY) {
            // Solo procesar si la entidad controlada es un pájaro
            if (this.controlEntity instanceof BirdEntity && this.controlEntity.berryCount > 0) {
                // Llamar al callback con la entidad que lanzó el poop
                if (this.onPoopLaunched) {
                    this.onPoopLaunched(this.controlEntity);
                }
            }
        }
    }

    handleStart(e) {
        e.preventDefault();
        
        // Obtener posición en coordenadas normalizadas
        const point = this.getPointFromEvent(e);
        this.startPoint = point;
        this.isDrawing = true;
        
        // Limpiar canvas
        this.clearCanvas();
    }

    handleMove(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        
        // Obtener posición en coordenadas normalizadas
        const point = this.getPointFromEvent(e);
        this.endPoint = point;
        
        // Redibujar
        this.clearCanvas();
        this.drawLine();
    }

    handleEnd(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        // Si está configurado para lanzamiento automático, lanzar la entidad
        if (this.autoLaunch && this.startPoint && this.endPoint) {
            this.launchEntity();
        }
        
        // Limpiar puntos y canvas
        this.clearCanvas();
        this.startPoint = null;
        this.endPoint = null;
    }

    // Obtener punto normalizado desde un evento
    getPointFromEvent(e) {
        let x, y;
        
        // Touch o mouse
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        // Convertir a coordenadas normalizadas
        return this.screenToNormalized(x, y);
    }

    // Limpiar el canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Convertir coordenadas normalizadas a coordenadas de pantalla para dibujar
    normalizedToScreen(x, y) {
        const scaleX = this.canvas.width / NORMALIZED_SPACE.WIDTH;
        const scaleY = this.canvas.height / NORMALIZED_SPACE.HEIGHT;
        
        return {
            x: x * scaleX,
            y: y * scaleY
        };
    }

    // Dibujar la línea de lanzamiento
    drawLine() {
        if (!this.startPoint || !this.endPoint || !this.isVisible) return;
        
        // Convertir a coordenadas de pantalla para dibujar
        const start = this.normalizedToScreen(this.startPoint.x, this.startPoint.y);
        const end = this.normalizedToScreen(this.endPoint.x, this.endPoint.y);
        
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = UI.DRAWING_PAD.STROKE_STYLE;
        this.ctx.lineWidth = UI.DRAWING_PAD.LINE_WIDTH;
        this.ctx.stroke();
        
        // Dibujar una flecha en la dirección del movimiento
        this.drawArrow(start, end);
    }
    
    // Dibujar una flecha para indicar dirección
    drawArrow(start, end) {
        const headlen = 10; // longitud de la cabeza de la flecha
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        
        // Dibujar la cabeza de la flecha
        this.ctx.beginPath();
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fillStyle = UI.DRAWING_PAD.STROKE_STYLE;
        this.ctx.fill();
    }    /**
     * @method launchEntity
     * @description Aplica velocidad a la entidad controlada basada en el gesto dibujado
     */
    launchEntity() {
        if (!this.controlEntity || !this.startPoint || !this.endPoint) return;

        // Calcular velocidad basada en la diferencia entre puntos, usando el factor personalizado
        const velocityX = (this.startPoint.x - this.endPoint.x) * this.speedFactor.X;
        const velocityY = (this.startPoint.y - this.endPoint.y) * this.speedFactor.Y;
        
        // Obtener el componente de física si existe
        const physicsComponent = this.controlEntity.getComponent
            ? this.controlEntity.getComponent(PhysicsComponent)
            : null;
        
        if (physicsComponent) {
            // Aplicar velocidad al componente de física
            physicsComponent.velocityX = - velocityX;
            physicsComponent.velocityY = - velocityY;
        } else {
            // Compatibilidad con el sistema antiguo
            this.controlEntity.velocityX = - velocityX;
            this.controlEntity.velocityY = - velocityY;
        }
    }    /**
     * @method setControlEntity
     * @description Establece la entidad a controlar y opcionalmente actualiza el factor de velocidad
     * @param {Entity} entity - La entidad a controlar
     * @param {Object|number} [speedFactor] - Factor de velocidad opcional para el movimiento
     */
    setControlEntity(entity, speedFactor) {
        this.controlEntity = entity;
        if (speedFactor) {
            this.speedFactor = speedFactor;
        }
    }    /**
     * @method setVisible
     * @description Establece la visibilidad del pad de dibujo
     * @param {boolean} visible - Indica si el pad debe ser visible
     */
    setVisible(visible) {
        this.isVisible = visible;
        this.canvas.style.display = visible ? 'block' : 'none';
        if (!visible) {
            this.clearCanvas();
        }
    }
    
    /**
     * @method dispose
     * @description Limpia los recursos y event listeners al finalizar
     */
    dispose() {
        // Eliminar event listeners
        this.canvas.removeEventListener('mousedown', this.handleStart);
        this.canvas.removeEventListener('mousemove', this.handleMove);
        this.canvas.removeEventListener('mouseup', this.handleEnd);
        this.canvas.removeEventListener('mouseout', this.handleEnd);
        
        this.canvas.removeEventListener('touchstart', this.handleStart);
        this.canvas.removeEventListener('touchmove', this.handleMove);
        this.canvas.removeEventListener('touchend', this.handleEnd);
        this.canvas.removeEventListener('touchcancel', this.handleEnd);
        
        window.removeEventListener('resize', this.resize);
        
        // Limpiar el canvas
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
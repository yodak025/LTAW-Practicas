import { UI, NORMALIZED_SPACE, DOM } from './constants.js';
import { PhysicsComponent, BirdEntity } from './entities.js';

export class DrawingPad {
    constructor(drawingPadCanvas, gameCanvas, controlEntity, speedFactor) {
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

        // Configurar tamaño inicial
        this.resize();

        // Configurar eventos de mouse/touch
        this.setupEventListeners();

        // Lanzamiento automático al soltar
        this.autoLaunch = true;
        
        // Callback para cuando se lanza un poop (será establecido por el controlador del juego)
        this.onPoopLaunched = null;
    }

    // Convertir coordenadas de pantalla a normalizadas
    screenToNormalized(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = NORMALIZED_SPACE.WIDTH / this.canvas.width;
        const scaleY = NORMALIZED_SPACE.HEIGHT / this.canvas.height;
        
        return {
            x: (x - rect.left) * scaleX,
            y: (y - rect.top) * scaleY
        };
    }

    // Redimensionar el canvas del DrawingPad
    resize() {
        // Calcular el tamaño y posición del drawing pad
        const gameRect = this.gameCanvas.getBoundingClientRect();
        const padSize = gameRect.height * 0.5; // Tamaño cuadrado igual a 1/2 de la altura del canvas
        
        // Configurar el tamaño del drawing pad (cuadrado)
        this.canvas.width = padSize;
        this.canvas.height = padSize;
        
        // Posicionar en la esquina inferior izquierda del canvas del juego
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = `${gameRect.top + gameRect.height - padSize}px`;
        
        // Añadir fondo semi-transparente
        this.canvas.style.backgroundColor = UI.DRAWING_PAD.BACKGROUND_COLOR;
        
        // Añadir un borde para mejor visibilidad
        this.canvas.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        this.canvas.style.zIndex = '10'; // Asegurar que esté por encima del canvas del juego
    }

    // Configuración de event listeners
    setupEventListeners() {
        // Eventos de ratón
        this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
        this.canvas.addEventListener('mouseout', this.handleEnd.bind(this)); // Cambiado de handleCancel a handleEnd

        // Eventos táctiles
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleEnd.bind(this)); // Cambiado de handleCancel a handleEnd

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

    // Método handleCancel mantenido por compatibilidad pero no se usa ahora
    handleCancel(e) {
        this.handleEnd(e);
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
    }

    // Lanzar la entidad controlada
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
    }

    // Mostrar/ocultar el pad de dibujo
    setVisible(visible) {
        this.isVisible = visible;
        if (!visible) {
            this.clearCanvas();
        }
    }
}
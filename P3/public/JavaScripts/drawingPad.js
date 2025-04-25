import { UI, NORMALIZED_SPACE } from './constants.js';

export class DrawingPad {
    constructor(drawingPadCanvas, gameCanvas, controlEntity) {
        this.canvas = drawingPadCanvas;
        this.gameCanvas = gameCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.controlEntity = controlEntity;
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.isVisible = true;

        // Configurar tamaño inicial
        this.resize();

        // Configurar eventos de mouse/touch
        this.setupEventListeners();

        // Lanzamiento automático al soltar
        this.autoLaunch = true;
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
        this.canvas.style.left = `${gameRect.left}px`;
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
        this.canvas.addEventListener('mouseout', this.handleCancel.bind(this));

        // Eventos táctiles
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleCancel.bind(this));

        // Evento de resize
        window.addEventListener('resize', this.resize.bind(this));
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

    handleCancel(e) {
        e.preventDefault();
        this.isDrawing = false;
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
    }

    // Lanzar la entidad controlada
    launchEntity() {
        if (!this.controlEntity || !this.startPoint || !this.endPoint) return;
        
        // Calcular velocidad basada en la diferencia entre puntos
        const velocityX = (this.startPoint.x - this.endPoint.x) * UI.DRAWING_PAD.SPEED_FACTOR;
        const velocityY = (this.startPoint.y - this.endPoint.y) * UI.DRAWING_PAD.SPEED_FACTOR;
        
        // Actualizar la entidad
        this.controlEntity.velocityX = - velocityX;
        this.controlEntity.velocityY = - velocityY;
    }

    // Mostrar/ocultar el pad de dibujo
    setVisible(visible) {
        this.isVisible = visible;
        if (!visible) {
            this.clearCanvas();
        }
    }
}
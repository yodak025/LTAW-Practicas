export class DrawingPad {
    constructor(canvas, targetEntity) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.targetEntity = targetEntity;
        this.isDrawing = false;
        this.startPoint = { x: 0, y: 0 };
        this.currentPoint = { x: 0, y: 0 };

        // Configurar tamaño y posición
        this.resize();

        // Event listeners
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        window.addEventListener('mouseup', this.endDrawing.bind(this));
        window.addEventListener('resize', this.resize.bind(this));

        // Estilo inicial
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
    }

    resize() {
        const size = Math.min(window.innerHeight / 2, window.innerHeight / 2);
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }

    startDrawing(event) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        this.currentPoint = { ...this.startPoint };
    }

    draw(event) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        this.currentPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar la línea
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        this.ctx.stroke();

        // Comprobar si el ratón está fuera del canvas
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) {
            this.endDrawing();
        }
    }

    endDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        // Calcular el vector de movimiento
        const dx = this.currentPoint.x - this.startPoint.x;
        const dy = this.currentPoint.y - this.startPoint.y;

        // Calcular la longitud del vector
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Normalizar respecto al tamaño del pad
        const maxLength = this.canvas.width;
        const speedFactor = 40; // Factor de velocidad base
        const normalizedLength = Math.min(length / maxLength, 1);

        // Calcular las velocidades normalizadas
        if (this.targetEntity) {
            this.targetEntity.velocityX = (dx / length) * normalizedLength * speedFactor;
            this.targetEntity.velocityY = (dy / length) * normalizedLength * speedFactor;
        }

        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setTargetEntity(entity) {
        this.targetEntity = entity;
    }
}
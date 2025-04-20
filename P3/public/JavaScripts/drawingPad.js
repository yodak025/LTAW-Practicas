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

        // Event listeners para ratón
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        window.addEventListener('mouseup', this.endDrawing.bind(this));

        // Event listeners para touch
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.endDrawing.bind(this));
        this.canvas.addEventListener('touchcancel', this.endDrawing.bind(this));

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

    handleTouchStart(event) {
        event.preventDefault(); // Prevenir scroll
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.isDrawing = true;
        this.startPoint = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        this.currentPoint = { ...this.startPoint };
    }

    handleTouchMove(event) {
        event.preventDefault(); // Prevenir scroll
        if (!this.isDrawing) return;

        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.currentPoint = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };

        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar la línea
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        this.ctx.stroke();

        // Comprobar si el touch está fuera del canvas
        if (touch.clientX < rect.left || touch.clientX > rect.right ||
            touch.clientY < rect.top || touch.clientY > rect.bottom) {
            this.endDrawing();
        }
    }

    startDrawing(event) {
        if (event.type === 'touchstart') return; // Ignorar eventos touch aquí
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        this.currentPoint = { ...this.startPoint };
    }

    draw(event) {
        if (event.type === 'touchmove') return; // Ignorar eventos touch aquí
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
        const speedFactor = 5000; // Aumentado considerablemente
        const normalizedLength = length / maxLength; // Eliminado el límite de 1

        // Calcular las velocidades normalizadas
        if (this.targetEntity) {
            this.targetEntity.velocityX = (dx / length) * normalizedLength * speedFactor;
            this.targetEntity.velocityY = (dy / length) * normalizedLength * speedFactor;
        }

        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    handleMouseUp() {
        if (this.isDrawing && this.points.length > 1) {
            const start = this.points[0];
            const end = this.points[this.points.length - 1];
            
            // Calcular el vector de dirección
            const dx = start.x - end.x;
            const dy = start.y - end.y;
            
            
            // Aumentar el factor de fuerza para compensar el deltaTime
            const forceFactor = 1000; // Aumentado de ~2-3 a 8
            
            // Aplicar la fuerza al objeto controlado
            this.controlledObject.velocityX = dx * forceFactor;
            this.controlledObject.velocityY = dy * forceFactor;
        }
    }
}
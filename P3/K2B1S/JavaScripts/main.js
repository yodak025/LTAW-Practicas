import { DynamicEntity, StaticEntity, BreakableEntity } from './entities.js';
import { DrawingPad } from './drawingPad.js';

const canvas = document.getElementById('canvas');
const drawingPadCanvas = document.getElementById('drawing-pad');
const ctx = canvas.getContext('2d');

// Array para almacenar todos los objetos del juego
const gameObjects = [];

// Crear objetos de prueba
const testObject = new DynamicEntity(100, 100, 50, 50);
gameObjects.push(testObject);

// Crear una plataforma estática
const platform = new StaticEntity(300, 400, 200, 20);
gameObjects.push(platform);

// Crear una plataforma rompible
const breakablePlatform = new BreakableEntity(500, 300, 100, 20);
gameObjects.push(breakablePlatform);

// Inicializar el DrawingPad con el objeto dinámico
const drawingPad = new DrawingPad(drawingPadCanvas, testObject);

function drawObject(gameObject) {
    // Color según el tipo de objeto
    if (gameObject instanceof BreakableEntity) {
        const healthPercent = gameObject.health / 100;
        ctx.fillStyle = gameObject.broken ? 'red' : `rgb(255, ${155 + (100 * healthPercent)}, 0)`;
    } else if (gameObject instanceof StaticEntity) {
        ctx.fillStyle = 'gray';
    } else {
        ctx.fillStyle = 'black';
    }
    
    ctx.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar todos los objetos
    for (const obj of gameObjects) {
        obj.update(gameObjects);
        drawObject(obj);
    }

    requestAnimationFrame(gameLoop);
}

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Configuración inicial
window.addEventListener('load', () => {
    resizeCanvas();
    gameLoop();
});
window.addEventListener('resize', resizeCanvas);




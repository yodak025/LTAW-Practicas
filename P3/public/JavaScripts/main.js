// Elementos DOM
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('game-container');
const singlePlayerButton = document.getElementById('singleplayer');
const multiPlayerButton = document.getElementById('multiplayer');
const canvas = document.getElementById('canvas');
const drawingPadCanvas = document.getElementById('drawing-pad');

// Importar constantes
import { NORMALIZED_SPACE, CANVAS, DOM, MESSAGES } from './constants.js';

// Inicializar Socket.IO
const socket = io();

// Función para redimensionar el canvas con relación de aspecto 16:9
function resizeCanvas() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Calcular el margen basado en el porcentaje definido en las constantes
    const marginPercentage = CANVAS.MARGIN_PERCENT / 100;
    const horizontalMargin = containerWidth * marginPercentage;
    const verticalMargin = containerHeight * marginPercentage;
    
    // Espacio disponible después de aplicar márgenes
    // Añadir margen adicional para asegurar que los bordes sean visibles
    const safetyMargin = Math.max(horizontalMargin, verticalMargin) * 0.5; // Margen de seguridad adicional
    
    const availableWidth = containerWidth - (horizontalMargin * 2) - safetyMargin;
    const availableHeight = containerHeight - (verticalMargin * 2) - safetyMargin;
    
    // Calcular dimensiones manteniendo estrictamente relación de aspecto 16:9
    let canvasWidth, canvasHeight;
    
    // Determinar la dimensión limitante (altura o anchura) para preservar la relación de aspecto
    if (availableWidth / availableHeight > NORMALIZED_SPACE.ASPECT_RATIO) {
        // La pantalla es más ancha que 16:9, limitar por altura
        canvasHeight = availableHeight;
        canvasWidth = canvasHeight * NORMALIZED_SPACE.ASPECT_RATIO;
    } else {
        // La pantalla es más alta que 16:9, limitar por anchura
        canvasWidth = availableWidth;
        canvasHeight = canvasWidth / NORMALIZED_SPACE.ASPECT_RATIO;
    }
    
    // Comprobación de seguridad para pantallas muy pequeñas
    const minVisibleWidth = CANVAS.MIN_VISIBLE_WIDTH;
    const minVisibleHeight = minVisibleWidth / NORMALIZED_SPACE.ASPECT_RATIO;
    
    if (canvasWidth < minVisibleWidth || canvasHeight < minVisibleHeight) {
        if (availableWidth < availableHeight * NORMALIZED_SPACE.ASPECT_RATIO) {
            canvasWidth = Math.min(minVisibleWidth, availableWidth);
            canvasHeight = canvasWidth / NORMALIZED_SPACE.ASPECT_RATIO;
        } else {
            canvasHeight = Math.min(minVisibleHeight, availableHeight);
            canvasWidth = canvasHeight * NORMALIZED_SPACE.ASPECT_RATIO;
        }
    }
    
    // Aplicar dimensiones al canvas de juego
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Aplicar dimensiones al canvas de dibujo
    // El drawing pad tiene su propia gestión de redimensionamiento
    
    // Centrar el contenedor del juego con un poco más de margen
    gameContainer.style.width = `${canvasWidth}px`;
    gameContainer.style.height = `${canvasHeight}px`;
    gameContainer.style.margin = 'auto';
    gameContainer.style.position = DOM.POSITION.CENTERED.POSITION;
    gameContainer.style.top = DOM.POSITION.CENTERED.TOP;
    gameContainer.style.left = DOM.POSITION.CENTERED.LEFT;
    gameContainer.style.transform = DOM.POSITION.CENTERED.TRANSFORM;
    gameContainer.style.backgroundColor = CANVAS.BACKGROUND_COLOR;
    
    // Añadir un borde para que sea visible en cualquier fondo
    gameContainer.style.boxShadow = CANVAS.BOX_SHADOW;
    
    // Aplicar un padding al contenedor para asegurar visibilidad completa
    gameContainer.style.padding = `${safetyMargin/4}px`;
    
    // Forzar una actualización del drawing pad después de cambiar el tamaño del canvas
    const drawingPads = document.querySelectorAll('[id^="drawing-pad"]');
    drawingPads.forEach(pad => {
        if (pad.resize) pad.resize();
    });
}

// Función para mostrar el juego y ocultar el menú
function showGame() {
    menu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resizeCanvas();
}

// Crear elementos para el menú de roles y salas
const roleMenu = document.createElement('div');
roleMenu.className = 'role-menu hidden';
roleMenu.innerHTML = `
    <h2>Elige tu rol</h2>
    <div class="role-buttons">
        <button id="bird-role">Jugar como Pájaro</button>
        <button id="stone-role">Jugar como Piedra</button>
    </div>
`;

const roomMenu = document.createElement('div');
roomMenu.className = 'room-menu hidden';
roomMenu.innerHTML = `
    <h2>Salas Disponibles</h2>
    <div class="create-room">
        <input type="text" id="room-name" placeholder="Nombre de la sala">
        <button id="create-room-btn">Crear Sala</button>
    </div>
    <div id="room-list"></div>
    <button id="back-to-role" class="back-button">Volver a selección de rol</button>
`;

document.body.appendChild(roleMenu);
document.body.appendChild(roomMenu);

let selectedPlayerType = null;

// Funciones para gestionar roles y salas
function showRoleMenu() {
    menu.classList.add('hidden');
    roleMenu.classList.remove('hidden');
}

function showRoomMenu() {
    roleMenu.classList.add('hidden');
    roomMenu.classList.remove('hidden');
    socket.emit('getRooms');
}

function updateRoomList(rooms) {
    const roomListDiv = document.getElementById('room-list');
    roomListDiv.innerHTML = '';
    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room-item';
        
        let statusText = '';
        let canJoin = false;
        
        if (selectedPlayerType === DOM.PLAYER_TYPES.BIRD) {
            if (room.hasBird) {
                statusText = MESSAGES.ROOM_STATUS.OCCUPIED_BIRD;
                canJoin = false;
            } else if (room.hasStone) {
                statusText = MESSAGES.ROOM_STATUS.AVAILABLE_BIRD;
                canJoin = true;
            } else {
                statusText = MESSAGES.ROOM_STATUS.EMPTY;
                canJoin = true;
            }
        } else { // stone
            if (room.hasStone) {
                statusText = MESSAGES.ROOM_STATUS.OCCUPIED_STONE;
                canJoin = false;
            } else if (room.hasBird) {
                statusText = MESSAGES.ROOM_STATUS.AVAILABLE_STONE;
                canJoin = true;
            } else {
                statusText = MESSAGES.ROOM_STATUS.EMPTY;
                canJoin = true;
            }
        }

        roomElement.innerHTML = `
            <span>${room.name} ${statusText}</span>
            <button ${!canJoin ? 'disabled' : ''}>Unirse</button>
        `;
        
        if (canJoin) {
            roomElement.querySelector('button').onclick = () => {
                socket.emit('joinRoom', {
                    roomName: room.name,
                    playerType: selectedPlayerType
                });
            };
        }
        
        roomListDiv.appendChild(roomElement);
    });
}

// Event Listeners
document.getElementById('bird-role').addEventListener('click', () => {
    selectedPlayerType = DOM.PLAYER_TYPES.BIRD;
    showRoomMenu();
});

document.getElementById('stone-role').addEventListener('click', () => {
    selectedPlayerType = DOM.PLAYER_TYPES.STONE;
    showRoomMenu();
});

document.getElementById('create-room-btn').addEventListener('click', () => {
    const roomName = document.getElementById('room-name').value.trim();
    if (roomName) {
        socket.emit('createRoom', {
            roomName,
            playerType: selectedPlayerType
        });
    }
});

document.getElementById('back-to-role').addEventListener('click', () => {
    roomMenu.classList.add('hidden');
    roleMenu.classList.remove('hidden');
});

// Socket.IO event handlers
socket.on('roomList', updateRoomList);

socket.on('startGame', ({playerType}) => {
    roomMenu.classList.add('hidden');
    showGame();
    
    // Cargar el juego correspondiente según el rol
    if (playerType === DOM.PLAYER_TYPES.BIRD) {
        import('./twoBirds.js')
            .then(module => {
                module.initBirdsGame(socket)
                    .catch(console.error);
            })
            .catch(console.error);
    } else {
        import('./oneStone.js')
            .then(module => {
                module.initStoneGame(socket)
                    .catch(console.error);
            })
            .catch(console.error);
    }
});

socket.on('playerDisconnected', (playerType) => {
    const message = playerType === DOM.PLAYER_TYPES.BIRD 
        ? MESSAGES.PLAYER_DISCONNECTED.BIRD 
        : MESSAGES.PLAYER_DISCONNECTED.STONE;
    alert(message);
    // Volver al menú principal
    gameContainer.classList.add('hidden');
    menu.classList.remove('hidden');
});

socket.on('gameReady', (isReady) => {
    if (isReady) {
        alert(MESSAGES.GAME_READY);
    }
});

socket.on('roomError', (error) => {
    alert(error);
});

socket.on('roomCreated', (roomName) => {
    socket.emit('joinRoom', {
        roomName,
        playerType: selectedPlayerType
    });
});

socket.on('roomJoined', ({roomName, playerType, isComplete}) => {
    roomMenu.classList.add('hidden');
    showGame();
    
    // Cargar el juego correspondiente según el rol
    if (playerType === DOM.PLAYER_TYPES.BIRD) {
        import('./twoBirds.js')
            .then(module => {
                module.initBirdsGame(socket)
                    .catch(console.error);
            })
            .catch(console.error);
    } else {
        import('./oneStone.js')
            .then(module => {
                module.initStoneGame(socket)
                    .catch(console.error);
            })
            .catch(console.error);
    }
});

// Botón de un jugador
singlePlayerButton.addEventListener('click', () => {
    showGame();
    import('./singlePlayer.js')
        .then(module => {
            module.initSinglePlayerMode()
                .catch(console.error);
        })
        .catch(console.error);
});

multiPlayerButton.addEventListener('click', showRoleMenu);

// Añadir evento de resize a la ventana
window.addEventListener('resize', resizeCanvas);

// Aplicar el tamaño inicial al cargar la página
window.addEventListener('load', () => {
    // Inicializar canvas con el fondo negro
    document.body.style.backgroundColor = CANVAS.BACKGROUND_COLOR;
});
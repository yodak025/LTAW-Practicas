// Elementos DOM
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('game-container');
const singlePlayerButton = document.getElementById('singleplayer');
const multiPlayerButton = document.getElementById('multiplayer');

// Inicializar Socket.IO
const socket = io();

// Función para mostrar el juego y ocultar el menú
function showGame() {
    menu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
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
        
        if (selectedPlayerType === 'bird') {
            if (room.hasBird) {
                statusText = '(Ocupado: Ya hay un pájaro)';
                canJoin = false;
            } else if (room.hasStone) {
                statusText = '(Disponible: Falta pájaro)';
                canJoin = true;
            } else {
                statusText = '(Vacía)';
                canJoin = true;
            }
        } else { // stone
            if (room.hasStone) {
                statusText = '(Ocupado: Ya hay una piedra)';
                canJoin = false;
            } else if (room.hasBird) {
                statusText = '(Disponible: Falta piedra)';
                canJoin = true;
            } else {
                statusText = '(Vacía)';
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
    selectedPlayerType = 'bird';
    showRoomMenu();
});

document.getElementById('stone-role').addEventListener('click', () => {
    selectedPlayerType = 'stone';
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
    if (playerType === 'bird') {
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
    alert(`El jugador ${playerType === 'bird' ? 'pájaro' : 'piedra'} se ha desconectado`);
    // Volver al menú principal
    gameContainer.classList.add('hidden');
    menu.classList.remove('hidden');
});

socket.on('gameReady', (isReady) => {
    if (isReady) {
        alert('¡La partida está lista! Ambos jugadores están conectados.');
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
    if (playerType === 'bird') {
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
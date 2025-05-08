import electron from 'electron';
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import qrcode from "qrcode-terminal";
import path from 'path';
import os from 'os';
import { readFileSync } from 'fs';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Arrancando electron...");

// Configuración del servidor
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 9000;

// Estructura para almacenar las salas
const rooms = {};

// Configurar el middleware para servir archivos estáticos
app.use(express.static(join(__dirname, "public")));

// Ruta por defecto - sirve index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).sendFile(join(__dirname, "public", "404.html"));
});

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  // Crear una nueva sala
  socket.on("createRoom", ({roomName, playerType}) => {
    if (!rooms[roomName]) {
      rooms[roomName] = {
        players: 1,
        birdPlayer: playerType === 'bird' ? socket.id : null,
        stonePlayer: playerType === 'stone' ? socket.id : null
      };
      socket.join(roomName);
      socket.emit("startGame", {
        roomName,
        playerType
      });
      broadcastRoomList();
    } else {
      socket.emit("roomError", "La sala ya existe");
    }
  });

  // Obtener lista de salas disponibles
  socket.on("getRooms", () => {
    const requestingPlayerType = Array.from(socket.rooms)[1] ? 
      (rooms[Array.from(socket.rooms)[1]]?.birdPlayer === socket.id ? 'bird' : 'stone') : 
      null;

    const roomInfo = Object.entries(rooms)
      .filter(([_, data]) => {
        if (data.birdPlayer && data.stonePlayer) return false;
        if (requestingPlayerType === 'bird') return !data.birdPlayer;
        if (requestingPlayerType === 'stone') return !data.stonePlayer;
        return true;
      })
      .map(([name, data]) => ({
        name,
        hasStone: !!data.stonePlayer,
        hasBird: !!data.birdPlayer
      }));

    socket.emit("roomList", roomInfo);
  });

  // Unirse a una sala
  socket.on("joinRoom", ({roomName, playerType}) => {
    const room = rooms[roomName];
    if (room) {
      if (playerType === 'bird' && room.birdPlayer) {
        socket.emit("roomError", "Ya hay un jugador pájaro en esta sala");
        return;
      }
      if (playerType === 'stone' && room.stonePlayer) {
        socket.emit("roomError", "Ya hay un jugador piedra en esta sala");
        return;
      }

      const currentRoom = Array.from(socket.rooms)[1];
      if (currentRoom) {
        leaveCurrentRoom(socket, currentRoom);
      }

      socket.join(roomName);
      if (playerType === 'bird') {
        room.birdPlayer = socket.id;
      } else {
        room.stonePlayer = socket.id;
      }
      room.players++;

      socket.emit("startGame", {
        roomName,
        playerType
      });
      
      if (room.birdPlayer && room.stonePlayer) {
        io.to(roomName).emit("gameReady", true);
      }
      
      broadcastRoomList();
    } else {
      socket.emit("roomError", "La sala no existe");
    }
  });

  // Función auxiliar para abandonar una sala
  function leaveCurrentRoom(socket, roomName) {
    const room = rooms[roomName];
    if (room) {
      socket.leave(roomName);
      if (room.birdPlayer === socket.id) {
        room.birdPlayer = null;
        if (room.stonePlayer) {
          io.to(roomName).emit("playerDisconnected", "bird");
        }
      }
      if (room.stonePlayer === socket.id) {
        room.stonePlayer = null;
        if (room.birdPlayer) {
          io.to(roomName).emit("playerDisconnected", "stone");
        }
      }
      room.players--;
      
      if (room.players === 0) {
        delete rooms[roomName];
      }
      broadcastRoomList();
    }
  }

  // Función auxiliar para transmitir la lista de salas actualizada
  function broadcastRoomList() {
    const clients = io.sockets.sockets;
    clients.forEach(client => {
      const clientId = client.id;
      const clientRoom = Array.from(client.rooms)[1];
      const clientType = clientRoom ? 
        (rooms[clientRoom]?.birdPlayer === clientId ? 'bird' : 'stone') : 
        null;

      const roomInfo = Object.entries(rooms)
        .filter(([_, data]) => {
          if (data.birdPlayer && data.stonePlayer) return false;
          if (clientType === 'bird') return !data.birdPlayer;
          if (clientType === 'stone') return !data.stonePlayer;
          return true;
        })
        .map(([name, data]) => ({
          name,
          hasStone: !!data.stonePlayer,
          hasBird: !!data.birdPlayer
        }));

      client.emit("roomList", roomInfo);
    });
  }

  // Manejar la actualización de posición del pájaro azul dentro de la sala
  socket.on("blueBirdUpdate", (position) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.birdPlayer === socket.id) {
      socket.to(room).emit("updateBlueBird", position);
    }
  });

  // Manejar la actualización de posición de la roca dentro de la sala
  socket.on("stoneUpdate", (position) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.stonePlayer === socket.id) {
      socket.to(room).emit("updateStone", position);
    }
  });

  // Manejar actualizaciones de estado de las entidades
  socket.on("blueBirdUpdate", (state) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.birdPlayer === socket.id) {
      socket.to(room).emit("updateBlueBird", state);
    }
  });

  socket.on("greenBirdUpdate", (state) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.birdPlayer === socket.id) {
      socket.to(room).emit("updateGreenBird", state);
    }
  });

  socket.on("stoneUpdate", (state) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.stonePlayer === socket.id) {
      socket.to(room).emit("updateStone", state);
    }
  });

  // Actualización de estado de berries (de cliente a cliente)
  socket.on("berryUpdate", (berryState) => {
    const room = Array.from(socket.rooms)[1];
    if (room) {
      socket.to(room).emit("berryUpdated", berryState);
    }
  });

  // Envío de evento de generación de berry (desde el jugador piedra al jugador pájaro)
  socket.on("berrySpawned", (berryData) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.stonePlayer === socket.id) {
      socket.to(room).emit("berrySpawned", berryData);
    }
  });

  // Envío de evento de generación de poop (desde el jugador pájaro al jugador piedra)
  socket.on("poopSpawned", (poopData) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.birdPlayer === socket.id) {
      socket.to(room).emit("poopSpawned", poopData);
    }
  });

  // Actualización de estado de poops (solo desde el jugador pájaro)
  socket.on("poopUpdate", (poopState) => {
    const room = Array.from(socket.rooms)[1];
    if (room && rooms[room]?.birdPlayer === socket.id) {
      socket.to(room).emit("poopUpdated", poopState);
    }
  });

  // Manejar evento de fin de juego
  socket.on("game-over", () => {
    const room = Array.from(socket.rooms)[1];
    if (room) {
      socket.to(room).emit("game-over");
      console.log(`Juego terminado en la sala: ${room}`);
    }
  });

  // Limpiar recursos al desconectar
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
    const room = Array.from(socket.rooms)[1];
    if (room) {
      leaveCurrentRoom(socket, room);
    }
  });
});

// Inicia el servidor antes de arrancar Electron
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Configuración de Electron
let serverWindow = null;
let clientWindows = [];

// Función para recopilar información del sistema
function getSystemInfo() {
  // Leer package.json para obtener información de dependencias
  let packageInfo;
  try {
    const packageJson = readFileSync(join(__dirname, 'package.json'), 'utf8');
    packageInfo = JSON.parse(packageJson);
  } catch (error) {
    console.error('Error al leer package.json:', error);
    packageInfo = { dependencies: {}, version: 'desconocida' };
  }
  
  return {
    // Versiones de entorno
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8,
    
    // Detalles del proyecto
    app: {
      name: packageInfo.name || 'Kill Two Birds with One Stone Server',
      version: packageInfo.version || '0.1.0',
      author: packageInfo.author || 'Desconocido',
    },
    
    // Dependencias del proyecto
    dependencies: packageInfo.dependencies || {},
    
    // Información del sistema
    platform: process.platform,
    arch: process.arch,
    osName: os.type(),
    osVersion: os.release(),
    cpuModel: os.cpus()[0]?.model || 'Desconocido',
    cpuCores: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + ' GB',
    freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)) + ' GB',
    
    // Tiempo de ejecución
    uptime: Math.floor(process.uptime()) + ' segundos',
  };
}

// Crear la ventana principal del servidor
function createServerWindow() {
  serverWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "Kill Two Birds with One Stone - Server",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar la interfaz del renderer
  serverWindow.loadFile(join(__dirname, "renderer", "index.html"));
  
  // Desactivar el menú
  serverWindow.setMenuBarVisibility(false);

  // Manejar cierre de la ventana
  serverWindow.on('closed', () => {
    serverWindow = null;
    // Cerrar todas las ventanas de cliente también
    clientWindows.forEach(clientWin => {
      if (!clientWin.isDestroyed()) clientWin.close();
    });
    clientWindows = [];
  });
}

// Crear una ventana de cliente
function createClientWindow() {
  const clientWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "Kill Two Birds with One Stone - Cliente",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar la página web del juego
  clientWindow.loadURL('http://localhost:9000/');
  
  // Desactivar el menú
  clientWindow.setMenuBarVisibility(false);

  // Generar un ID único para esta ventana
  const clientId = Date.now().toString();
  
  // Manejar el cierre de la ventana cliente
  clientWindow.on('closed', () => {
    // Eliminar de la lista de clientes
    clientWindows = clientWindows.filter(win => win !== clientWindow);
  });
  
  // Añadir a la lista de ventanas de cliente
  clientWindows.push(clientWindow);
  
  // Notificar al renderer
  if (serverWindow && !serverWindow.isDestroyed()) {
    serverWindow.webContents.send('client-launched', clientId);
  }
  
  return clientId;
}

// Eventos de la aplicación Electron
electron.app.on('ready', () => {
  console.log("Evento Ready!");
  createServerWindow();
  
  // Configurar canales IPC para comunicación con el renderer
  electron.ipcMain.on('launch-client', (event) => {
    const clientId = createClientWindow();
    event.reply('client-launched', clientId);
  });
  
  // Canal para salir de la aplicación
  electron.ipcMain.on('quit-app', () => {
    // Cerrar todas las ventanas
    clientWindows.forEach(win => {
      if (!win.isDestroyed()) win.close();
    });
    
    // Cerrar la aplicación
    electron.app.quit();
  });
  
  // Canal para enviar información del sistema
  electron.ipcMain.on('get-system-info', (event) => {
    const systemInfo = getSystemInfo();
    event.reply('system-info', systemInfo);
  });
});

// Manejo de eventos adicionales de la aplicación Electron
electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  if (serverWindow === null) {
    createServerWindow();
  }
});




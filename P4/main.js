import electron from 'electron';
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import qrcode from "qrcode-terminal";
import path from 'path';
import os from 'os';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Arrancando electron...");

// Directorio para almacenar la configuración
const configDir = join(__dirname, 'config');
if (!existsSync(configDir)) {
  mkdirSync(configDir, { recursive: true });
}

// Ruta del archivo de constantes modificadas
const customConstantsPath = join(configDir, 'custom-constants.json');

// Cargar constantes originales
let gameConstants = {};
try {
  const constantsFile = readFileSync(join(__dirname, 'public', 'game', 'constants.js'), 'utf8');
  // Extraer las constantes definidas en el archivo
  gameConstants = extractConstantsFromJS(constantsFile);
  console.log("Constantes originales cargadas");
} catch (error) {
  console.error('Error al cargar constantes originales:', error);
}

// Cargar constantes personalizadas si existen
let customConstants = {};
if (existsSync(customConstantsPath)) {
  try {
    const customConstantsContent = readFileSync(customConstantsPath, 'utf8');
    customConstants = JSON.parse(customConstantsContent);
    console.log("Constantes personalizadas cargadas");
  } catch (error) {
    console.error('Error al cargar constantes personalizadas:', error);
  }
}

// Fusionar constantes originales con las personalizadas
mergeConstants(gameConstants, customConstants);

// Función para extraer constantes de un archivo JS
function extractConstantsFromJS(content) {
  const constants = {};
  
  // Buscar todas las declaraciones de exportación
  // Por ejemplo: export const NORMALIZED_SPACE = { ... }
  const exportRegex = /export const (\w+) = ({[\s\S]*?});/g;
  let match;
  
  while ((match = exportRegex.exec(content)) !== null) {
    const constantName = match[1];
    const constantValue = match[2];
    
    try {
      // Convertir el texto a un objeto JavaScript
      // Esto es necesario porque el valor está en formato de código JS, no JSON
      // Primero reemplazamos las propiedades no válidas en JSON como comentarios
      const cleanValue = constantValue
        .replace(/\/\/.*$/gm, '') // Eliminar comentarios de línea
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Eliminar comentarios multilínea
      
      // Eval es peligroso en general, pero en este caso controlado es la mejor
      // forma de convertir el código JS a un objeto
      const evalFunction = new Function(`return ${cleanValue}`);
      constants[constantName] = evalFunction();
    } catch (error) {
      console.error(`Error al parsear la constante ${constantName}:`, error);
      constants[constantName] = {};
    }
  }
  
  return constants;
}

// Función para fusionar objetos profundos
function mergeConstants(target, source) {
  // Recorrer cada propiedad del objeto fuente (constantes personalizadas)
  for (const key in source) {
    // Si la propiedad es un objeto y no un array, y existe en target
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      // Recursivamente fusionar los objetos
      mergeConstants(target[key], source[key]);
    } else {
      // De lo contrario, sobrescribir el valor en el objeto objetivo
      target[key] = source[key];
    }
  }
}

// Función para actualizar valores de constantes usando rutas con punto
function updateConstantsByPath(constants, paths) {
  for (const path in paths) {
    const value = paths[path];
    const parts = path.split('.');
    
    // El primer nivel suele ser el nombre de la constante exportada (ENTITY, UI, etc)
    const topLevelConstant = parts[0];
    
    // Si no existe la constante de primer nivel, saltar esta actualización
    if (!constants[topLevelConstant]) {
      console.warn(`La constante de primer nivel '${topLevelConstant}' no existe`);
      continue;
    }
    
    // Caso especial cuando solo hay una parte (constante de nivel superior)
    if (parts.length === 1) {
      constants[topLevelConstant] = value;
      continue;
    }
    
    // Navegar por el objeto hasta el penúltimo nivel
    let current = constants[topLevelConstant];
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    // Establecer el valor en el último nivel
    const lastKey = parts[parts.length - 1];
    current[lastKey] = value;
  }
}

// Guardar las constantes modificadas
function saveCustomConstants(constants) {
  try {
    // Convertir el objeto de modificaciones a un formato de paths
    // para mantener la consistencia con cómo se aplican las actualizaciones
    const pathsToSave = {};
    
    // Recorrer las rutas y guardar
    for (const path in constants) {
      pathsToSave[path] = constants[path];
    }
    
    // Guardar el archivo JSON
    writeFileSync(customConstantsPath, JSON.stringify(pathsToSave, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al guardar constantes personalizadas:', error);
    return false;
  }
}

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

// Servir constantes personalizadas en formato JavaScript
app.get("/game/custom-constants.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  
  // Construir el contenido JavaScript para las constantes
  let jsContent = '// Constantes personalizadas generadas por el servidor\n\n';
  
  // Para cada constante, crear una declaración export const
  for (const key in gameConstants) {
    jsContent += `export const ${key} = ${JSON.stringify(gameConstants[key], null, 2)};\n\n`;
  }
  
  res.send(jsContent);
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
  
  // Canal para obtener constantes del juego
  electron.ipcMain.on('get-game-constants', (event) => {
    event.reply('game-constants', gameConstants);
  });
  
  // Canal para actualizar constantes del juego
  electron.ipcMain.on('update-game-constants', (event, modifiedConstants) => {
    try {
      // Actualizar constantes
      updateConstantsByPath(gameConstants, modifiedConstants);
      
      // Guardar las constantes personalizadas
      const saved = saveCustomConstants(modifiedConstants);
      
      // Notificar a todos los clientes que las constantes han cambiado
      io.emit('constants-updated', true);
      
      // Notificar al renderer que las constantes se actualizaron correctamente
      event.reply('constants-updated', { success: saved });
    } catch (error) {
      console.error('Error al actualizar constantes:', error);
      event.reply('constants-updated', { success: false, error: error.message });
    }
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




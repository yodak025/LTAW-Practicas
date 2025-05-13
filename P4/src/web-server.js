import express from "express";
import { dirname, join } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import qrcode from "qrcode-terminal";
import os from "os";
import { readFileSync } from 'fs';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables globales
let app;
let httpServer;
let io;
let rooms = {};
let gameConstants = {};
let onConstantsUpdatedCallback = null;

/**
 * Inicializa el servidor web
 * @param {number} port - Puerto en el que escuchará el servidor
 * @param {Object} constants - Constantes del juego
 * @param {Function} onConstantsUpdated - Callback que se ejecuta cuando se actualizan las constantes
 * @returns {Object} - Objeto con la instancia del servidor y el puerto
 */
export function initWebServer(port, constants, onConstantsUpdated) {
  // Guardar referencias globales
  gameConstants = constants;
  onConstantsUpdatedCallback = onConstantsUpdated;
  
  // Configuración del servidor
  app = express();
  httpServer = createServer(app);
  io = new Server(httpServer);
  const PORT = port || 9000;

  // Interceptar solicitudes específicas antes de servir archivos estáticos
  // Interceptar la solicitud del archivo constants.js
  app.get("/game/constants.js", (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    // Leer el archivo constants.js original como plantilla
    try {
      const constantsFilePath = join(dirname(dirname(__filename)), "public", "game", "constants.js");
      const originalFileContent = readFileSync(constantsFilePath, 'utf8');
      
      // Generar un nuevo contenido que mantenga los comentarios y formato pero con los valores actualizados
      let jsContent = generateConstantsFileContent(originalFileContent);
      
      console.log("Sirviendo constants.js modificado");
      res.send(jsContent);
    } catch (error) {
      console.error("Error al servir constants.js:", error);
      
      // Si hay un error, generar un archivo básico con las constantes actuales
      let jsContent = '// Constantes del juego - Versión modificada por el servidor\n\n';
      
      // Para cada constante, crear una declaración export const
      for (const key in gameConstants) {
        jsContent += `export const ${key} = ${JSON.stringify(gameConstants[key], null, 2)};\n\n`;
      }
      
      res.send(jsContent);
    }
  });

  // Configurar el middleware para servir archivos estáticos
  app.use(express.static(join(dirname(dirname(__filename)), "public")));

  // Ruta por defecto - sirve index.html
  app.get("/", (req, res) => {
    res.sendFile(join(dirname(dirname(__filename)), "public", "index.html"));
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
    res.status(404).sendFile(join(dirname(dirname(__filename)), "public", "404.html"));
  });

  // Configuración de Socket.IO
  setupSocketIO();

  // Inicia el servidor
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    
    // Generar código QR para conectarse desde móvil
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const k in interfaces) {
      for (const k2 in interfaces[k]) {
        const address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    
    if (addresses.length > 0) {
      console.log('Para conectarte desde otro dispositivo, escanea este código QR:');
      qrcode.generate(`http://${addresses[0]}:${PORT}`);
    }
  });
  
  return { server: httpServer, port: PORT };
}

/**
 * Genera el contenido del archivo constants.js manteniendo comentarios y formato pero con valores actualizados
 * @param {string} originalContent - Contenido original del archivo
 * @returns {string} - Contenido actualizado
 */
function generateConstantsFileContent(originalContent) {
  // Obtener estructura del archivo original, extraer comentarios y formato
  const lines = originalContent.split('\n');
  let outputContent = '';
  let currentConstant = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar líneas de exportación de constantes
    const exportMatch = line.match(/export const (\w+)/);
    if (exportMatch) {
      currentConstant = exportMatch[1];
      
      // Si la constante existe en nuestro objeto de constantes, usarla
      if (gameConstants[currentConstant]) {
        // Agregar el comentario si hay uno en la línea actual
        const commentMatch = line.match(/\/\/(.*)/);
        const comment = commentMatch ? ` //${commentMatch[1]}` : '';
        
        // Agregar la constante actualizada
        outputContent += `export const ${currentConstant} = ${JSON.stringify(gameConstants[currentConstant], null, 2)};${comment}\n\n`;
      } else {
        // Si la constante no existe, mantener la línea original
        outputContent += line + '\n';
      }
      
      // Saltar líneas hasta el próximo punto y coma (final de la constante)
      while (i < lines.length - 1 && !lines[i].includes(';')) {
        i++;
      }
    } else {
      // Mantener líneas de comentarios y otras líneas sin cambios
      outputContent += line + '\n';
    }
  }
  
  return outputContent;
}

/**
 * Configura los manejadores de eventos para Socket.IO
 */
function setupSocketIO() {
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
}

/**
 * Notifica a todos los clientes que las constantes han sido actualizadas
 */
export function notifyConstantsUpdated() {
  if (io) {
    io.emit('constants-updated', true);
  }
}

/**
 * Cierra el servidor web
 */
export function closeServer() {
  if (httpServer) {
    httpServer.close();
  }
}
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

import qrcode from "qrcode-terminal";

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 9000;

// Configurar el middleware para servir archivos estáticos
app.use(express.static(join(__dirname, "public")));

// Ruta por defecto - sirve index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.get("/twoBirds", (req, res) => {
  const chapucisima = fs.readFileSync(
    join(__dirname, "public", "index.html"),
    "utf-8"
  );
  const modifiedChapucisima = chapucisima.replace("main.js", "twoBirds.js");
  res.send(modifiedChapucisima);
});

app.get("/oneStone", (req, res) => {
  const chapucisima = fs.readFileSync(
    join(__dirname, "public", "index.html"),
    "utf-8"
  );
  const modifiedChapucisima = chapucisima.replace("main.js", "oneStone.js");
  res.send(modifiedChapucisima);
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).sendFile(join(__dirname, "public", "404.html"));
});

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  // Manejar la actualización de posición del pájaro azul
  socket.on("blueBirdUpdate", (position) => {
    socket.broadcast.emit("updateBlueBird", position);
  });

  // Manejar la actualización de posición de la roca
  socket.on("rockUpdate", (position) => {
    socket.broadcast.emit("updateRock", position);
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`TwoBirds: http://192.168.0.11:${PORT}/twoBirds`);
  qrcode.generate(`http://192.168.0.11:${PORT}/twoBirds`);
  console.log(`OneStone: http://192.168.0.11:${PORT}/oneStone`);
  qrcode.generate(`http://192.168.0.11:${PORT}/oneStone`);
});

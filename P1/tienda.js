// Servidor para la tienda online de la práctica 1 de LTAW

const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8001;

const lmstudioUrl ="http://localhost:1234/v1/chat/completions";

// Crea el objeto con los datos de la petición
const requestData = {
  model: "meta-llama-3.1-8b-instruct",
  messages: [
    { role: "system", content: "Always answer in rhymes." },
    { role: "user", content: "Haz una poesia sobre el cambio climatico en castellano" }
  ],
  temperature: 0.7,
  max_tokens: -1, // -1 o ajusta según la cantidad deseada
  stream: false  // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
};

// Función asíncrona para enviar la petición y procesar la respuesta
async function callLMStudioAPI() {
  try {
    // Enviar la petición POST con el cuerpo en formato JSON
    const response = await fetch(lmstudioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Imprimir la respuesta en la consola
    console.log("Respuesta de la API:", data.choices[0].message.content);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

callLMStudioAPI();

const server = http.createServer((req, res) => {
  // Log the incoming request
  console.log(`Incoming request: ${req.method} ${req.url}`);

  // Determinar la ruta del archivo solicitado
  
  const ROOT = './P1/frontend/dist';// ! Esto es extremadamente cutre, Diego. 
  let filePath = ROOT + req.url;
  if (filePath === ROOT + '/') {
    filePath += 'index.html';
  }

  // Log the resolved file path
  console.log(`Serving file: ${filePath}`);

  // Determinar el Content-Type en base a la extensión del archivo
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case 'svg':
      contentType = 'image/svg+xml';
      break;
    }

  // Leer y servir el archivo solicitado
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Log file not found error
        console.error(`File not found: ${filePath}`);
        // Si el archivo no existe, servir un 404 personalizado
        fs.readFile('./P1/frontend/dist/public/error-404.html', (err404, content404) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content404, 'utf-8');
  
        });
      } else {
        // Log internal server error
        console.error(`Server error reading ${filePath}: ${error.code}`);
        // Otros errores: error interno del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${error.code}`);
      }
    } else {
      // Log successful file serving
      console.log(`File served successfully: ${filePath}`);
      // Archivo encontrado, se envía al navegador con un status 200
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () => console.log('Servidor corriendo en http://127.0.0.1:' + PORT + '/'));
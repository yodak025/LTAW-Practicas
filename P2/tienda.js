

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

const lmstudioUrl ="http://localhost:1234/v1/chat/completions";

// Crea el objeto con los datos de la petición
const generateLLMRequest = (msg) => {


  return {
  model: "meta-llama-3.1-8b-instruct",
  messages: [
    { role: "system", content: 
      `Genera una carta de presentación profesional para buscar trabajo utilizando la siguiente plantilla JSON. 
      Reemplaza los marcadores de posición (placeholders) con información original, resaltando la experiencia, habilidades y motivación del candidato de manera orgánica. 
      La carta debe tener un tono formal y personalizado, y estar estructurada según el siguiente esquema:\n\n
      {\n  \"nombre\": \"{{nombre}}\",
      \n  \"direccion\": \"{{direccion}}\",
      \n  \"telefono\": \"{{telefono}}\",
      \n  \"email\": \"{{email}}\",
      \n  \"fecha\": \"{{fecha}}\",
      \n  \"destinatario\": \"{{nombre del destinatario}}\",
      \n  \"empresa\": \"{{nombre de la empresa}}\",
      \n  \"cargo\": \"{{cargo o posición a solicitar}}\",
      \n  \"introduccion\": \"{{Breve introducción en la que se explica quién eres y el motivo de la carta}}\",
      \n  \"experiencia\": \"{{Resumen de tu experiencia y logros relevantes para el puesto}}\",
      \n  \"habilidades\": \"{{Descripción de tus habilidades y competencias clave}}\",
      \n  \"motivacion\": \"{{Razones por las que te postulas y cómo puedes aportar al puesto y a la empresa}}\",
      \n  \"cierre\": \"{{Cierre de la carta con una invitación a una entrevista o llamada a la acción}}\"\n}\n\n
      Utiliza esta estructura y asegúrate de que la respuesta mantenga la coherencia y el formato indicado.
      Entrega un resultado final que no contenga placeholders y que sea adecuado para ser enviado a un empleador potencial sin ser revisado.
      Evita incluir comentarios en tu respuesta. Entrega solo el contenido de la carta de presentación. Genera los saltos de línea necesarios para que el texto sea legible.` 
    },
    { role: "user", content: "rellena la plantilla con la siguiente información: " + JSON.stringify(msg) }
  ],
  temperature: 0.3,
  max_tokens: -1, // -1 o ajusta según la cantidad deseada
  stream: false  // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
};
};

// Función asíncrona para enviar la petición y procesar la respuesta
async function callLMStudioAPI(requestData) {
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
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}


const parsePostToJson = (postBody) => {
  let parsed = {};
  const pairs = postBody.split('&');
  pairs.forEach((pair) => {
    const key = pair.split('=')[0];
    const value = pair.split('=')[1];
    parsed[key] = value;
  });
  return parsed;
};



const server = http.createServer((req, res) => {
  // Log the incoming request
  console.log(`Incoming request: ${req.method} ${req.url}`);

  // Determinar la ruta del archivo solicitado
  
  const ROOT = './P2/frontend';// ! Esto es extremadamente cutre, Diego. 
  let filePath = ROOT + req.url;
  if (filePath === ROOT + '/') {
    filePath += 'index.html';
  }

  // Log the resolved file path
  console.log(`Serving file: ${filePath}`);
  
  let LLMResponse = ''; 

  let postBody = '';

  if(req.method === 'POST') {
    

    req.on('data', (chunk) => {
      postBody += chunk.toString();
    });  

    req.on('end', () => {
      return
    });


  }

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
  fs.readFile(filePath, async (error, content) => {
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

      if (req.url == '/document.html' ) {
        documentPage = fs.readFileSync('./P2/frontend/document.html', 'utf-8')
        LLMResponse = await callLMStudioAPI(generateLLMRequest(parsePostToJson(postBody)));
        content = documentPage.replace('$DocumentContent', LLMResponse);
      }

      res.end(content, 'utf-8');
    }
  });
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () => console.log('Servidor corriendo en http://127.0.0.1:' + PORT + '/'));
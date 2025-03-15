const http = require("http");
const fs = require("fs");
const path = require("path");
const { documentGenerationRequest } = require('./document-generation/documentRequest.js');

const PORT = 8001;

const getRequestedResourceFilePath = (request) => {
  const ROOT = "./P2/frontend" ; 
  let filePath = ROOT + request;
  if (filePath === ROOT + "/") {
    filePath += "index.html";
  }
  return filePath;
}

const determinateContentType = (extname) => {
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case "svg":
      contentType = "image/svg+xml";
      break;
  }
  return contentType;
}


const server = http.createServer((req, res) => {
  // Imprime la petición entrante en la consola
  console.log(`Petición entrante: ${req.method} ${req.url}`);

  // Determinar la ruta del archivo solicitado
  filePath = getRequestedResourceFilePath(req.url); // ! Unhandled error si req.url es undefined

  // Imprimir la ruta del archivo solicitado en la consola
  console.log(`Sirviendo el archivo: ${filePath}`);

  // Leer el cuerpo de la petición (si existe)
  let reqBody = "";
  req.on("data", (chunk) => {
    reqBody += chunk.toString();
  });


  // Determinar el Content-Type en base a la extensión del archivo
  const contentType = determinateContentType( path.extname( filePath ) );

  // Leer y servir el archivo solicitado
  fs.readFile(filePath, async ( error, content ) => {
    if ( error ) {
      if ( error.code === "ENOENT" ) {
        // Log file not found error
        console.error(`File not found: ${filePath}`);
        // Si el archivo no existe, servir un 404 personalizado
        fs.readFile(
          "./P1/frontend/dist/public/error-404.html",
          (err404, content404) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content404, "utf-8");
          }
        );
      } else {
        // Log internal server error
        console.error(`Server error reading ${ filePath }: ${ error.code }`);
        // Otros errores: error interno del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${ error.code }`);
      }
    } else {
      // Log successful file serving
      console.log(`File served successfully: ${ filePath }`);
      // Archivo encontrado, se envía al navegador con un status 200
      res.writeHead(200, { "Content-Type": contentType });

      if (req.url == "/document.html") {
        documentPage = fs.readFileSync("./P2/frontend/document.html", "utf-8");
        LLMResponse = await documentGenerationRequest(reqBody);
        htmlResponse = ""
        LLMResponse.split("\n").forEach((line) => 
          htmlResponse += `<p>${line}</p>`
        );
        content = documentPage.replace("$DocumentContent", htmlResponse);
        console.log(reqBody)
      }

      res.end(content, "utf-8");
    }
  });
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () =>
  console.log("Servidor corriendo en http://127.0.0.1:" + PORT + "/")
);

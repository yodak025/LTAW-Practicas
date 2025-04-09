import http from "http";
import fs from "fs";

import JsonRusticDatabase from "./server/classJsonRusticDatabase.js";
import RequestAnalyser from "./server/classRequestAnalyser.js";
import ResponsePacker from "./server/classResponsePacker.js";
import renderPage from "./server/rusticServerSideRendering.jsx";


const PORT = 8001;

//------------------------------------- SERVER --------------------------------
const db = new JsonRusticDatabase("./server/tienda.json");

const server = http.createServer(async (req, res) => {
  // Leer la base de datos al iniciar el servidor
  await db.readDatabase();

  // Imprime la petición entrante en la consola
  console.log(`Petición entrante: ${req.method} ${req.url}`);

  const reqData = new RequestAnalyser(req, db.users);
  // Si se pide un recurso dinámico, se carga template.html y se renderiza el componente al vuelo
  let resourcePath = reqData.isDynamic
    ? "./server/public/template.html"
    : `./server/public${reqData.resourceDemipath}`;

  if (reqData.headers["Set-Cookie"])
    res.setHeader("Set-Cookie", reqData.headers["Set-Cookie"]);

  // Imprimir la ruta del archivo solicitado en la consola
  console.log(`Sirviendo el archivo: ${resourcePath}`);

  try {
    const requestData = await reqData.analyzeRequest(req);

    if (req.method === 'POST' && req.url === '/document.html') {
      const responsePacker = new ResponsePacker();
      const response = await responsePacker.packResponse(requestData);

      res.writeHead(response.code, response.headers);
      res.write(response.body);
      res.end();
      return;
    }

    // Leer y servir el archivo solicitado
    fs.readFile(resourcePath, async (error, content) => {
      let resData = null;
      if (error) {
        if (error.code === "ENOENT") {
          // Log file not found error
          console.error(`File not found: ${resourcePath}`);
          // Si el archivo no existe, servir un 404 personalizado
          // ? Pido perdón a quien corresponda, chatGPT me ha convencido de que esto es más eficiente
          let content404 = await (async () => {
            return new Promise((resolve) => {
              fs.readFile("./server/public/template.html", "utf-8", (_, data) => {
                resolve(data);
              });
            });
          })();
          content404 = renderPage(content404, "/error-404.html", reqData.isDarkTheme);

          resData = new ResponsePacker(
            404,
            "./server/public/template.html",
            content404,
            reqData.headers["Set-Cookie"]
          );
        } else {
          // Log internal server error
          console.error(`Server error reading ${resourcePath}: ${error.code}`);
          // Otros errores: error interno del servidor
          resData = new ResponsePacker(
            500,
            "./server/public/undefined.html",
            `<h1>Error interno del servidor:</h1>  
            <p>Server error reading ${resourcePath}: ${error.code}</p>`,
            reqData.headers["Set-Cookie"]
          );
        }
      } else {
        // Log successful file serving
        console.log(`File served successfully: ${resourcePath}`);
        // Archivo encontrado, se envía al navegador con un status 200
        if (reqData.isDynamic) {
          content = renderPage(content, reqData.resourceDemipath, reqData.isDarkTheme);
            
        } 

        resData = new ResponsePacker(
          200,
          resourcePath,
          content,
          reqData.headers["Set-Cookie"]
        );
      }
      res.writeHead(resData.statusCode, resData.getResponseHead());
      res.end(resData.content, "utf-8");
    });
    // reescribir la base de datos
    db.writeDatabase();
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () =>
  console.log("Servidor corriendo en http://127.0.0.1:" + PORT + "/")
);

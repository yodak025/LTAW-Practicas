import http from "http";
import fs from "fs";
import printLog from "./server/logs.js";

import JsonRusticDatabase from "./server/classJsonRusticDatabase.js";
import RequestAnalyser from "./server/classRequestAnalyser.js";
import ResponsePacker from "./server/classResponsePacker.js";
import renderPage from "./server/rusticServerSideRendering.jsx";
import documentGenerationRequest from "./server/document-generation/documentRequest.js";

const PORT = 8001;

//------------------------------------- SERVER --------------------------------
const db = new JsonRusticDatabase("./server/tienda.json");

db.readDatabase();

const server = http.createServer(async (req, res) => {
  // Leer la base de datos al iniciar el servidor
  
  // Imprime la petición entrante en la consola

  const reqData = new RequestAnalyser(req, db);
  if (req.method == "POST") {
    await reqData.recievePostData(req);
  }

  switch (reqData.ajax){
    case null:
      break;
    case "cart":
      db.addOrderToCart(reqData);
      res.writeHead(200, { "Content-Type": "text/plain" , "Set-Cookie": db.getCartCookie(reqData.user.usuario)});
      res.end();
      db.writeDatabase();
      printLog("ajax", "cart", reqData.resourceDemipath);
      return;
    case "theme":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end();
      printLog("ajax", "theme", reqData.resourceDemipath);
      db.writeDatabase();
      return;
    case "search":
      const products = db.findProductsByDemiName(reqData.body);
      const searchResults = products.map((p) => {
        return {
          id: p.nombre,
          name: p.titulo
        };
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(searchResults), "utf-8");
      printLog("ajax", "search", reqData.resourceDemipath);
      return;
  }
    
  

  // Si se pide un recurso dinámico, se carga template.html y se renderiza el componente al vuelo
  let resourcePath = reqData.isDynamic
    ? "./server/public/template.html"
    : `./server/public${reqData.resourceDemipath}`;

  if (reqData.headers["Set-Cookie"])
    res.setHeader("Set-Cookie", reqData.headers["Set-Cookie"]);

  // Imprimir la ruta del archivo solicitado en la consola

  // Leer y servir el archivo solicitado
  fs.readFile(resourcePath, async (error, content) => {
    let resData = null;
    if (error) {
      if (error.code === "ENOENT") {
        // Log file not found error
        // Si el archivo no existe, servir un 404 personalizado
        // ? Pido perdón a quien corresponda, chatGPT me ha convencido de que esto es más eficiente
        let content404 = await (async () => {
          return new Promise((resolve) => {
            fs.readFile("./server/public/template.html", "utf-8", (_, data) => {
              resolve(data);
            });
          });
        })();
        content404 = renderPage(
          content404,
          "/error-404.html",
          reqData
        );
        printLog("error404", null, reqData.resourceDemipath);

        resData = new ResponsePacker(
          404,
          "./server/public/template.html",
          content404,
          reqData.headers["Set-Cookie"]
        );
      } else {
        // Log internal server error
        printLog("error", error.code, null);
        // Otros errores: error interno del servidor
        resData = new ResponsePacker(
          500,
          "./server/public/undefined.html",
          `<h1>Error interno del servidor:</h1>  
          <p>Error leyendo el recurso ${resourcePath}: ${error.code}</p>`,
          reqData.headers["Set-Cookie"]
        );
      }
    } else {
      // Archivo encontrado, se envía al navegador con un status 200
      if (reqData.isDynamic) {
        // Si se pide un documento, primero debe ser generado
        content = renderPage(
          content,
          reqData.resourceDemipath,
          reqData,
          db
        );
      }

      resData = new ResponsePacker(
        200,
        resourcePath,
        content,
        reqData.headers["Set-Cookie"]
      );
      printLog(
        resData.contentType,
        resourcePath,
        `${req.method} ${req.url}`
        
      );
    }
    res.writeHead(resData.statusCode, resData.getResponseHead());
    res.end(resData.content, "utf-8");
  });
  // reescribir la base de datos
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () =>
  console.log("Servidor corriendo en http://127.0.0.1:" + PORT + "/")
);

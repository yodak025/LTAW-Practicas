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

console.log("\nIniciando servidor...\n");
db.readDatabase();

const server = http.createServer(async (req, res) => {
  const reqData = new RequestAnalyser(req, db);
  if (req.method == "POST") {
    await reqData.recievePostData(req);
  }
  /* Peticiones AJAX */
  switch (reqData.ajax) {
    case null:
      break;

    case "update-cart":
      let newCart = db.updateCart(reqData);
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Set-Cookie": newCart,
      });
      res.end();
      db.writeDatabase();
      printLog("ajax", "add-to-cart", newCart);
      return;

    case "add-to-cart":
      db.addOrderToCart(reqData);
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Set-Cookie": db.getCartCookie(reqData.user.usuario),
      });
      res.end();
      db.writeDatabase();
      printLog("ajax", "add-to-cart", reqData.body);
      return;

    case "new-order":
      db.updateCart(reqData);
      let cart = db.users.filter((u) => u.usuario == reqData.user.usuario)[0]
        .carrito;
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Set-Cookie": "cart=",
      });
      res.end();
      printLog(
        "ajax",
        "new-order",
        `user: ${reqData.user.usuario}, mail: ${reqData.body.mail}, card: ${reqData.body.card}`
      );

      /* Procesamiento asíncrono de documentos */
      printLog("processing-order", cart, null);

      const documentPromises = cart.map((order, index) => {
        printLog(
          "generating-document",
          { idx: index, type: order.tipo, content: JSON.parse(order.cuerpo)},
          null
        );
        return documentGenerationRequest(order.tipo, order.cuerpo); //-- Llamada a la API
      });

      const documents = await Promise.all(documentPromises);
      printLog("processed-order", null, null);

      db.addNewOrder(
        documents,
        reqData.user.usuario,
        reqData.body.mail,
        reqData.body.card
      );

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
          name: p.titulo,
        };
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(searchResults), "utf-8");
      printLog("ajax", "search", reqData.resourceDemipath);
      return;
  }

  //-- Si se pide un recurso dinámico, se carga template.html y se renderiza el componente al vuelo
  let resourcePath = reqData.isDynamic
    ? "./server/public/template.html"
    : `./server/public${reqData.resourceDemipath}`;

  if (reqData.headers["Set-Cookie"])
    res.setHeader("Set-Cookie", reqData.headers["Set-Cookie"]);


  // Leer y servir el archivo solicitado
  fs.readFile(resourcePath, async (error, content) => {
    let resData = null;
    if (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe, servir un 404 personalizado
        // ? Pido perdón a quien corresponda, chatGPT me ha convencido de que esto es más eficiente
        // ? para que la lectura sea asíncrona y haga una espera bloqueante pero sobre el proceso y no sobre el hilo
        let content404 = await (async () => {
          return new Promise((resolve) => {
            fs.readFile("./server/public/template.html", "utf-8", (_, data) => {
              resolve(data);
            });
          });
        })();
        content404 = renderPage(content404, "/error-404.html", reqData);
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
        content = renderPage(content, reqData.resourceDemipath, reqData, db);
      }

      resData = new ResponsePacker(
        200,
        resourcePath,
        content,
        reqData.headers["Set-Cookie"]
      );
      printLog(resData.contentType, resourcePath, `${req.method} ${req.url}`);
    }
    res.writeHead(resData.statusCode, resData.getResponseHead());
    res.end(resData.content, "utf-8");
  });
});

server.listen(PORT, async () => {
  // Actualizar la base de datos cada 5 segundos si ha habido cambios
  setInterval(() => {
    if (db.isModified) {
      console.log("\nActualizando base de datos...".bgWhite);
      db.writeDatabase();
      db.isModified = false;
      console.log("\nBase de datos actualizada correctamente\n".bgGreen);
    }
  }, 5000);
  console.log("\nServidor corriendo en http://127.0.0.1:" + PORT + "/\n");
});

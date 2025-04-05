const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  documentGenerationRequest,
} = require("./server/document-generation/documentRequest.js");

const PORT = 8001;

// ------------------------------------- AUXILIARY FUNCTIONS ------------------
const getResourcePath = (resDemipath) => {
  const ROOT = "./P2/frontend/dist";
  let resPath = resDemipath === "/" ? ROOT + "/index.html" : ROOT + resDemipath;
  return resPath;
};

const findContentType = (extname) => {
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
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }
  return contentType;
};

//------------------------------------- DATABASE ------------------------------
let users,
  products,
  orders = undefined;

fs.readFile("./P2/tienda.json", "utf-8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo JSON:", err);
    return;
  }
  try {
    const jsonData = JSON.parse(data);
    users = jsonData.usuarios;
    products = jsonData.productos;
    orders = jsonData.pedidos;
  } catch (parseError) {
    console.error("Error al analizar el JSON:", parseError);
  }
});
//------------------------------------- Request Analysis ----------------------

class RequestAnalyser {
  constructor(req) {
    this.resourceDemipath = req.url;
    this.headers = {};
    this.user = null;
    this.body = null;

    //-- Cambios inmediatos --//
    switch (req.url) {
      case "/" || "/index.html":
        this.getUserFormCookie(req.headers.cookie);
        if (this.user) this.resourceDemipath = "/index.html";
        else this.resourceDemipath = "/login.html";
        break;

      case "/assets/colors.css":
        this.getUserFormCookie(req.headers.cookie);
        if (this.user.tema == "dark")
          this.resourceDemipath = "/assets/darkColors.css";
        else this.resourceDemipath = "/assets/colors.css";
        break;
    }
    //-- Peticiones Get --//
    if (req.url.includes("/login?")) {
      // TODO : Si el usuario no existe, debe notificarse el error
      this.resourceDemipath = "/login.html";
      const user = req.url.split("?")[1].split("=")[1];
      users.forEach((u) => {
        if (u.usuario == user) {
          this.headers["Set-Cookie"] = [`user=${user}`]; //! OJO: Esto solo funciona si no hay mas cookies
          this.resourceDemipath = "/index.html";
        }
      });
    }

    req.on("data", (chunk) => {
      //! Mucho me temo que esto podría ser un cabo suelto
      this.body += chunk.toString();
    });

    req.on("end", () => {
      //-- Peticiones POST --//
    });
  }

  getUserFormCookie = (cookie) => {
    if (cookie) {
      const userCookie = cookie.split(";")[0].split("=")[1];
      users.forEach((u) => {
        if (u.usuario == userCookie) this.user = u;
      });
    }
  };
}

//------------------------------------- Response Packer ------------------------
class ResponsePacker {
  constructor(statusCode, contentType, content, cookies = null) {
    this.statusCode = statusCode;
    this.contentType = contentType;
    this.content = content;
    if (cookies) {
      this.cookies = cookies;
    } else {
      this.cookies = null;
    }
  }
  getResponseHead() {
    const headers = {
      "Content-Type": this.contentType,
    };
    if (this.cookies) {
      headers["Set-Cookie"] = this.cookies;
    }
    return headers;
  }

}

//------------------------------------- SERVER --------------------------------

const server = http.createServer((req, res) => {
  // Imprime la petición entrante en la consola
  console.log(`Petición entrante: ${req.method} ${req.url}`);

  const reqData = new RequestAnalyser(req);
  let resourcePath = getResourcePath(reqData.resourceDemipath);
  let contentType = findContentType(path.extname(resourcePath));

  if (reqData.headers["Set-Cookie"])
    res.setHeader("Set-Cookie", reqData.headers["Set-Cookie"]);

  // Imprimir la ruta del archivo solicitado en la consola
  console.log(`Sirviendo el archivo: ${resourcePath}`);

  // Leer y servir el archivo solicitado
  fs.readFile(resourcePath, async (error, content) => {
    let resData = null;
    if (error) {
      if (error.code === "ENOENT") {
        // Log file not found error
        console.error(`File not found: ${resourcePath}`);
        // Si el archivo no existe, servir un 404 personalizado
        // ? Pido perdón a quien corresponda, chatGPT me ha convencido de que esto es más eficiente
        const content404 = await (async() => {
          return new Promise((resolve) => {
            fs.readFile("./P1/frontend/dist/error-404.html",
            "utf-8", (_, data) => { resolve(data) });
          });
        })();

        resData = new ResponsePacker(
          404,
          "text/html",
          content404,
          reqData.headers["Set-Cookie"]
        );
      } else {
        // Log internal server error
        console.error(`Server error reading ${resourcePath}: ${error.code}`);
        // Otros errores: error interno del servidor
        resData = new ResponsePacker(
          500,
          "text/html",
          `<h1>Error interno del servidor:</h1>  
          <p>Server error reading ${resourcePath}: ${error.code}</p>`,
          reqData.headers["Set-Cookie"]
        );
      }
    } else {
      // Log successful file serving
      console.log(`File served successfully: ${resourcePath}`);
      // Archivo encontrado, se envía al navegador con un status 200
      resData = new ResponsePacker(
        200,
        contentType,
        content,
        reqData.headers["Set-Cookie"]
      );

      if (req.url == "/document.html") {
        documentPage = fs.readFileSync("./P2/frontend/document.html", "utf-8");
        LLMResponse = await documentGenerationRequest(reqBody);
        htmlResponse = "";
        LLMResponse.split("\n").forEach(
          (line) => (htmlResponse += `<p>${line}</p>`)
        );
        content = documentPage.replace("$DocumentContent", htmlResponse);
        console.log(reqBody);
      }
      
    }
    res.writeHead(resData.statusCode, resData.getResponseHead());
    res.end(resData.content, "utf-8");
  });
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () =>
  console.log("Servidor corriendo en http://127.0.0.1:" + PORT + "/")
);

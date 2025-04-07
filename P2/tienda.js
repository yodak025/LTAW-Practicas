import http, { get } from "http";
import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";

import JsonRusticDatabase from "./server/classJsonRusticDatabase.js";

import App from "./components/pages/App.jsx";
import ProductPage from "./components/pages/ProductPage.jsx";
import LoginPage from "./components/pages/Login.jsx";
import Error404 from "./components/pages/Error404.jsx";

const PORT = 8001;



//-------------------------------------- React Rendering ----------------------
// TODO: Renderizado explícito de App.jsx

const renderPage = (name, component, template, styles, hydrateScript) => {
  const html = renderToString(component);
  const styleTags = styles.map(
    (style) => `<link rel="stylesheet" href="${style}" /> \n`
  );

  return template
    .toString("utf-8")
    .replace("$Name", name)
    .replace("$RenderedPage", html)
    .replace("$Styles", styleTags)
    .replace("$HydrateScript", hydrateScript);
};

//------------------------------------- Request Analysis ----------------------

class RequestAnalyser {
  constructor(req, users) {
    this.dbUsers = users;
    this.resourceDemipath = req.url;
    this.headers = {};
    this.user = null;
    this.body = null;
    this.isDynamic = false;
    this.isDarkTheme = false;

    //-- Cambios inmediatos --//

    switch (req.url) {
      case "/":
        this.resourceDemipath = "/index.html";
      case "/index.html":
      case "/product.html":
        this.getUserFromCookie(req.headers.cookie);
        if (!this.user) this.resourceDemipath = "/login.html";
        this.isDynamic = true;
        if (this.user && this.user.tema == "dark") this.isDarkTheme = true;
        break;
    }
    //-- Peticiones Get --//
    if (req.url.includes("/login?")) {
      this.resourceDemipath = "/login.html"; // TODO : Si el usuario no existe, debe notificarse el error
      const user = req.url.split("?")[1].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == user) {
          this.headers["Set-Cookie"] = [`user=${user}`]; //! OJO: Esto solo funciona si no hay mas cookies
          this.resourceDemipath = "/index.html";
          if (u.tema == "dark") {
            this.isDarkTheme = true;
          }
        }
      });
    }

    if (req.url.includes("/register?")) {
      // TODO No es muy coherente con la clase
      // ! FALTA CONTROLAR EL TEMAAAA
      this.resourceDemipath = "/index.html";
      const registerData = req.url.split("?")[1].split("&");
      const user = registerData[0].split("=")[1];
      const fullName = registerData[1].split("=")[1];
      const email = registerData[2].split("=")[1];

      this.headers["Set-Cookie"] = [`user=${user}`]; //! OJO: Esto solo funciona si no hay mas cookies

      this.dbUsers.forEach((u) => {
        // TODO : Si el usuario existe, debe notificarse el error
        if (u.usuario == user) {
          return;
        }
        this.dbUsers.push({
          usuario: user,
          nombre: fullName,
          email: email,
          tema: "light",
        });
      });
    }

    if (req.url.includes("/update-theme?")) {
      const updatedTheme = req.url.split("?")[1].split("=")[1];
      this.setUserPropsFromCookie(req.headers.cookie, { tema: updatedTheme });
      if (this.user.tema == "dark") this.isDarkTheme = true;
    }

    req.on("data", (chunk) => {
      //! Mucho me temo que esto podría ser un cabo suelto
      this.body += chunk.toString();
    });

    req.on("end", () => {
      //-- Peticiones POST --//
    });
  }

  getUserFromCookie = (cookie) => {
    if (cookie) {
      const userCookie = cookie.split(";")[0].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) this.user = u;
      });
    }
  };

  setUserPropsFromCookie = (cookie, userProps) => {
    if (cookie) {
      const userCookie = cookie.split(";")[0].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) {
          if (u.usuario == userCookie) {
            this.user = u;
            u.usuario = userProps.usuario || u.usuario;
            u.nombre = userProps.nombre || u.nombre;
            u.email = userProps.email || u.email;
            u.tema = userProps.tema || u.tema;
          }
        }
      });
    }
  };
}

//------------------------------------- Response Packer ------------------------
class ResponsePacker {
  constructor(statusCode, contentPath, content, cookies = null) {
    this.statusCode = statusCode;
    this.contentType = this._findContentType(path.extname(contentPath));
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
  _findContentType = (extname) => {
    let contentType = "plain/text";
    // Definir el tipo de contenido según la extensión del archivo
    switch (extname) {
      case ".html":
        contentType = "text/html";
        break;
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
      case ".ttf":
        contentType = "font/ttf";
        break;
    }
    return contentType;
  };
}

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
    : `./server/public/${reqData.resourceDemipath}`;

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
        let content404 = await (async () => {
          return new Promise((resolve) => {
            fs.readFile("./server/public/template.html", "utf-8", (_, data) => {
              resolve(data);
            });
          });
        })();
        content404 = renderPage(
          "Error 404",
          <Error404 />,
          content404,
          [
            reqData.isDarkTheme
              ? "/styles/colors-darkMode.css"
              : "/styles/colors.css",
            "/styles/Nav.css",
            "/styles/Layout.css",
            "/styles/Product.css",
            "/styles/Category.css",
            "/styles/App.css",
          ],
          null
        );

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
        const themeStyle = reqData.isDarkTheme
          ? "/styles/colors-darkMode.css"
          : "/styles/colors.css";
        switch (reqData.resourceDemipath) {
          case "/index.html":
            content = renderPage(
              "Tienda Online",
              <App />,
              content,
              [
                themeStyle,
                "/styles/Nav.css",
                "/styles/Layout.css",
                "/styles/Product.css",
                "/styles/Category.css",
                "/styles/App.css",
              ],
              "/bundleApp.js"
            );
            break;
          case "/product.html":
            content = renderPage(
              "Producto",
              <ProductPage />,
              content,
              [
                themeStyle,
                "/styles/Nav.css",
                "/styles/Layout.css",
                "/styles/productPage.css",
                "/styles/App.css",
              ],
              "bundleProduct.js"
            );
            break;
          case "/login.html":
            content = renderPage(
              "Inicio de Sesión",
              <LoginPage />,
              content,
              [
                themeStyle,
                "/styles/Nav.css",
                "/styles/Layout.css",
                "/styles/Login.css",
                "/styles/App.css",
              ],
              "bundleLogin.js"
            );
            break;
          case "/error-404.html":
            content = renderPage("Tienda Online", <App />, content, [
              themeStyle,
              "/styles/Nav.css",
              "/styles/Layout.css",
              "/styles/Product.css",
              "/styles/Category.css",
              "/styles/App.css",
            ]);
            break;
        }
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
});

// Escucha en el puerto 8001 (puedes cambiarlo si lo necesitas)
server.listen(PORT, () =>
  console.log("Servidor corriendo en http://127.0.0.1:" + PORT + "/")
);

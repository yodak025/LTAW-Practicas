import React from "react";
import { renderToString } from "react-dom/server";

import App from "../components/App";

//-------------------------------------- React Rendering ----------------------

/**
 * @function renderPage
 * @description Generador de páginas al vuelo con React. determina el contenido
 * de la página en función de la ruta y el usuario. Modifica la plantilla HTML
 * para incluir los estilos y scripts necesarios. La página renderizada se inyecta
 * en la plantilla HTML. La plantilla solicita el script bundle.js para hidratar 
 * la página, como se suele hacer en Server Side Rendering.
 * @param {string} template - Plantilla HTML.
 * @param {string} resourcePath - Ruta del recurso.
 * @param {object} reqData - Datos de la petición.
 * @param {object} db - Base de datos.
 * @returns {string} - Página HTML renderizada.
 */
export default function renderPage(template, resourcePath, reqData, db) {
  let name = "AI Scribe"; 
  let styles = [`/styles/colors.css`];
  const props = { content: null };
  props.userName = reqData.user ? reqData.user.usuario : null;

  //-- En función de la ruta se determina el contenido de la página --//

  if (resourcePath.includes("/product.html")) {
    // Se fuerza el paso por la base de datos por motivos didácticos, no es necesario pero así se le da uso
    // a la base de datos 
    const productId = resourcePath.split("?")[1].split("=")[1];
    const product = db.products.filter((p => p.nombre == productId))[0];
    props.content = product.componente;

    styles.push(
      "/styles/Nav.css",
      "/styles/Layout.css",
      "/styles/App.css",
      productId=="dev"? "/styles/productPage.css":"/styles/forms.css",//! Chapuza provisional durante el desarrollo
    );
  } else if (resourcePath.includes("/document.html")) {
    const documentId = resourcePath.split("?")[1].split("=")[1];
    const body = db.getDocumentFromAbsoluteIndex(documentId).doc.cuerpo;
    props.document = body;
    props.content = "Document";

    styles.push(
      "/styles/Nav.css",
      "/styles/Layout.css",
      "/styles/Document.css",
      "/styles/App.css"
    );
  }

  switch (resourcePath) {
    case "/index.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/Product.css",
        "/styles/Category.css",
        "/styles/App.css"
      );
      props.content = "Products";
      break;
    case "/process-order.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/ProcessOrder.css",
        "/styles/App.css"
      );
      props.content = "ProcessOrder";
      break;

    case "/my-documents.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/MyDocuments.css",
        "/styles/App.css"
      );
      props.content = "MyDocuments";
      let indexes = db.getDocumentAbsoluteIndexesFromUser(
        reqData.user.usuario
      );
      props.documents = indexes.map((index) => {
        const { date, doc } = db.getDocumentFromAbsoluteIndex(index);
        return {
          index: index,
          type: doc.tipo,
          date: date
        };

      });
      break;
    case "/login.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/Login.css",
        "/styles/App.css"
      );
      props.content = "Login";
      break;
    case "/error-404.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/Product.css",
        "/styles/Category.css",
        "/styles/App.css"
      );
      props.content = "Error404";
      break;
  }


  //-- Se añaden los estilos CSS --//
  const styleTags = styles
    .map((style) => `<link rel="stylesheet" href="${style}" /> \n`)
    .join("");

  //-- Se renderiza la página con React --//
  const html = renderToString(<App props={props} />);

  //-- Se inyectan las props directamente en el HTML en forma de script
  //   Se asignan como propiedad de window para que el script de hidratación
  //   pueda acceder a este contenido para hidratar la applicación --//
  const initialStateScript = `<script defer>
      window.__INITIAL_STATE__ = ${JSON.stringify(props)}
    </script>`;

  //-- Se incluye el script de hidratación --//
  const hydrateScript = `<script src="/bundle.js" defer></script>`;

  //-- Se inyecta el contenido en la plantilla HTML --//
  return template
    .toString("utf-8")
    .replace("$Name", name)
    .replace("$RenderedPage", html)
    .replace("$Styles", styleTags)
    .replace("$InitialState", initialStateScript)
    .replace("$HydrateScript", hydrateScript);
}

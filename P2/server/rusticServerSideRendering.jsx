import React from "react";
import { renderToString } from "react-dom/server";

import App from "../components/App";

//-------------------------------------- React Rendering ----------------------

export default function renderPage(template, resourcePath, reqData, db) {
  let name = "AI Scribe"; //TODO - Replantear
  let styles = [`/styles/colors-${reqData.isDarkTheme ? "dark" : "default"}.css`];
  const props = { content: null };
  props.userName = reqData.user ? reqData.user.usuario : null;

  if (resourcePath.includes("/product.html")) {
    // Se fuerza el paso por la base de datos de forma didactica, no es necesario pero así se le da uso
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
    const body = db.getDocumentFromAbsoluteIndex(documentId).cuerpo;
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
        return {
          index: index,
          type: db.getDocumentFromAbsoluteIndex(index).tipo,
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

  const styleTags = styles
    .map((style) => `<link rel="stylesheet" href="${style}" /> \n`)
    .join("");

  const html = renderToString(<App props={props} />);

  const initialStateScript = `<script defer>
      window.__INITIAL_STATE__ = ${JSON.stringify(props)}
    </script>`;
  const hydrateScript = `<script src="/bundle.js" defer></script>`;

  return template
    .toString("utf-8")
    .replace("$Name", name)
    .replace("$RenderedPage", html)
    .replace("$Styles", styleTags)
    .replace("$InitialState", initialStateScript)
    .replace("$HydrateScript", hydrateScript);
}

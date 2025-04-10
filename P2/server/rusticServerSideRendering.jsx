import React from "react";
import { renderToString } from "react-dom/server";

import App from "../components/App";

//-------------------------------------- React Rendering ----------------------

export default function renderPage(template, resourcePath, isDarkTheme, db) {
  let name = "AI Scribe";
  let styles = [`/styles/colors-${isDarkTheme ? "dark" : "default"}.css`];
  const props = { content: null };

  if (resourcePath.includes("/document.html")){
    const documentId = resourcePath.split("?")[1].split("=")[1];
    const document = db.orders[documentId].content;
    return `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        ${document}
      </body>
    </html>`;
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
    case "/product.html":
      styles.push(
        "/styles/Nav.css",
        "/styles/Layout.css",
        "/styles/forms.css",
        "/styles/App.css"
      );
      props.content = "ProductPage";
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

  const html = renderToString(<App content={props.content} />);

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

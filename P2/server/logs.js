import colors from "colors";

export default function printLog(type, resource, request) {
  switch (type) {
    case "plain/text":
      console.log(
        `Petición entrante: ${request}. \n  Recurso servido con éxito.\n    Nombre: ${resource}\n    Tipo: ${type} 📋\n\n `
          .grey
      );
      break;
    case "text/html":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 💻 \n\n`
          .green
      );
      break;
    case "application/json":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 📦 \n\n`
          .bgYellow
      );
      break;
    case "image/png":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n\n`
          .magenta
      );
      break;
    case "image/jpg":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n\n`
          .magenta
      );
      break;
    case "image/svg+xml":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n\n`
          .magenta
      );
      break;
    case "font/ttf":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🔠 \n\n`
          .magenta
      );
      break;
    case "text/javascript":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 📜 \n\n`
          .yellow
      );
      break;
    case "text/css":
      console.log(
        `Petición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🎨 \n\n`
          .magenta
      );
      break;
    case "ajax":
      console.log(
        `Petición AJAX procesada.\n  Tipo: ${resource}.\nRespuesta enviada.\n\n`
          .cyan
      );
      break;
    case "error404":
      console.log(
        `Petición errónea.\n  Recurso no encontrado: ${request}.\nRespuesta enviada.\n\n`
          .red
      );
      break;
    case "error500":
      console.log(
        `Error interno del servidor.\n  Error: ${resource}.\nRespuesta enviada.\n\n`
          .red
      );
      break;
  }
}

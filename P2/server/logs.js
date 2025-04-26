import colors from "colors";

export default function printLog(type, resource, request) {
  switch (type) {
    case "plain/text":
      console.log(
        `\nPetición entrante: ${request}. \n  Recurso servido con éxito.\n    Nombre: ${resource}\n    Tipo: ${type} 📋\n `
          .grey
      );
      break;
    case "text/html":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 💻 \n`
          .green
      );
      break;
    case "application/json":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 📦 \n`
          .bgYellow
      );
      break;
    case "image/png":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n`
          .magenta
      );
      break;
    case "image/jpg":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n`
          .magenta
      );
      break;
    case "image/svg+xml":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🖼️ \n`
          .magenta
      );
      break;
    case "font/ttf":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🔠 \n`
          .magenta
      );
      break;
    case "text/javascript":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 📜 \n`
          .yellow
      );
      break;
    case "text/css":
      console.log(
        `\nPetición entrante: ${request}.\n  Recurso servido con éxito.\n    Nombre: ${resource}.\n    Tipo: ${type} 🎨 \n`
          .magenta
      );
      break;
    case "ajax":
      console.log(
        `\nPetición AJAX procesada.\n  Tipo: ${resource}. \n    contenido: ${request}\nRespuesta enviada.\n`
          .cyan
      );
      break;
    case "generate-document":
      console.log(
        `\nPetición de generación de documento procesada.\n  Tipo: ${resource}.\n    contenido: ${request}\n Generando documento...\n`
          .blue
      );
      break
    case "error404":
      console.log(
        `\nPetición errónea.\n  Recurso no encontrado: ${request}.\nRespuesta enviada.\n`
          .red
      );
      break;
    case "error500":
      console.log(
        `\nError interno del servidor.\n  Error: ${resource}.\nRespuesta enviada.\n`
          .red
      );
      break;
    
  }
}

import colors from "colors";

function printStructure(obj, depth = 0) {
  let result = "";
  const indent = "  ".repeat(depth); // Dos espacios por nivel

  for (const key in obj) {
    result += `${indent}- ${key}\n`;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result += printStructure(obj[key], depth + 1);
    }
  }

  return result;
}

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

    //-- Documentos --\\

    case "processing-order":
      const documents = resource.map((order, index) => {
        return `  ${index + 1}. ${order.tipo}.\n`.underline.blue;
      });

      console.log(
        `\nNuevo pedido recibido:\n${documents}Procesando pedido...\n`.underline
          .bold.blue
      );
      break;

    case "processed-order":
      console.log(`\n¡Orden procesada con éxito!\n`.bold.underline.blue);
      break;

    case "generating-document":
      console.log(
        `\nDocumento ${resource.idx + 1}:\n  Tipo: ${
          resource.type
        }.\n  Contenido: \n${printStructure(
          resource.content,
          2
        )}Generando documento...\n`.bold.blue
      );
      break;
    case "generated-document":
      console.log(
        `\n¡Documento generado con éxito!\n  Estructura: \n${printStructure(
          resource,
          2
        )}`.bold.blue
      );
      break;

    case "document-api-request":
      console.log(
        `\nEnviando petición al modelo ${request.model} vía ${request.apiAddress}.\n`
          .underline.blue
      );
      console.log(`  Contenido: ${resource}.\nEsperando respuesta...\n`.blue);
      break;

    case "document-api-response":
      console.log(
        `\nRespuesta del modelo ${request} recibida.\n`.underline.blue
      );
      console.log(`Contenido: ${resource}.\nEsperando respuesta...\n`.blue);
      break;

    //-- Errores --\\

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

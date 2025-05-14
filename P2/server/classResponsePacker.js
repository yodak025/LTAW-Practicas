import path from "path";

//------------------------------------- Response Packer ------------------------

/**
 * @class ResponsePacker
 * @classdesc 
 * Clase para empaquetar respuestas HTTP. Genera el encabezado y el tipo de contenido
 * según la extensión del archivo. Permite establecer cookies y el código de estado.
 */
class ResponsePacker {

  /**
   * @constructor
   * @param {number} statusCode - Código de estado HTTP.
   * @param {string} contentPath - Ruta del archivo de contenido.
   * @param {string} content - Contenido a enviar en la respuesta.
   * @param {string|null} cookies - Cookies a establecer en la respuesta.
   */
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

  /**
   * @method getResponseHead
   * @description
   * Genera el encabezado de la respuesta HTTP.
   * Incluye el tipo de contenido y las cookies si están presentes.
   * @returns {object} - Objeto con los encabezados de la respuesta.
   */
  getResponseHead() {
    const headers = {
      "Content-Type": this.contentType,
    };
    if (this.cookies) {
      headers["Set-Cookie"] = this.cookies;
    }
    return headers;
  }

  /**
   * @method getResponse
   * @param {string} extname - Extensión del archivo.
   * @returns {string} content type.
   */
  _findContentType = (extname) => {
    let contentType = "plain/text";
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
export default ResponsePacker;
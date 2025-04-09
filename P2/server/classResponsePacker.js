import path from "path";

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

  async packResponse(requestData) {
    if (requestData.type === 'document' && requestData.method === 'POST') {
      const response = {
        status: 'success',
        message: 'Form data received successfully',
        data: requestData.formData
      };

      return {
        code: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      };
    }
  }
}
export default ResponsePacker;
import url from "url";
const URL = url.URL;
//------------------------------------- Request Analysis ----------------------

const THEMES = ["default", "dark", "coolwarm", "greengoldy", "futuristic", "fruit"];

/**
 * @class RequestAnalyser
 * @classdesc
 * Clase que analiza las peticiones HTTP y caracteriza su contenido.
 */
class RequestAnalyser {
  /**
   * @constructor
   * @param {object} req - Objeto de la petición HTTP.
   * @param {object} db - Objeto de la base de datos.
   * @description
   * clasifica y determina las características de la petición HTTP.
   */
  constructor(req, db) {
    this.dbUsers = db.users;
    this.resourceDemipath = req.url;
    this.headers = {};
    this.user = null;
    this.body = "";
    this.ajax = null;
    this.isDynamic = false;
    this.theme = "default";

    this.urlContent = new URL(req.url, `http://${req.headers.host}`);

    //-- Peticiones GET sin parámetros --//

    switch (req.url) {
      case "/":
        this.resourceDemipath = "/index.html";
      case "/index.html":
        this.getUserFromCookie(req.headers.cookie);
        this.isDynamic = true;
        break;
      case "/login.html":
        this.isDynamic = true;
        break;
      case "/update-cart":
        this.ajax = "update-cart";
        this.getUserFromCookie(req.headers.cookie);
        this.cart = this.getCookies(req.headers.cookie)["cart"];
        break;
      case "/process-order.html":
        this.isDynamic = true;
        this.getUserFromCookie(req.headers.cookie);
        break;
      case "/my-documents.html":
        this.isDynamic = true;
        this.getUserFromCookie(req.headers.cookie);
        if (!this.user) this.resourceDemipath = "/login.html";
        break;
      case "/logout":
        this.resourceDemipath = "/login.html";
        this.isDynamic = true;
        this.headers["Set-Cookie"] = [`user=;`, `cart=;`];
        this.user = null;
        this.isDarkTheme = false;
        break;
      case "/styles/colors.css":
        this.getUserFromCookie(req.headers.cookie);
        if (!this.user) {
          this.resourceDemipath = "/styles/colors-default.css";
          return;
        }
        switch (this.user.tema) {
            
          case "dark":
            this.resourceDemipath = "/styles/colors-dark.css";
            break;
          case "coolwarm":
            this.resourceDemipath = "/styles/colors-coolwarm.css";
            break;
          case "greengoldy":
            this.resourceDemipath = "/styles/colors-greengoldy.css";
            break;
          case "futuristic":
            this.resourceDemipath = "/styles/colors-futuristic.css";
            break;
          case "fruit": 
            this.resourceDemipath = "/styles/colors-fruit.css";
            break;
          default:
            this.resourceDemipath = "/styles/colors-default.css";
            break;
        }
      break;
    }
    //-- Peticiones GET con parámetros --//

    if (req.url.includes("/login?")) {
      this.isDynamic = true;
      this.resourceDemipath = "/login.html"; 
      const user = this.urlContent.searchParams.get("username");
      this.dbUsers.forEach((u) => {
        if (u.usuario == user) {
          this.headers["Set-Cookie"] = [`user=${user}`, db.getCartCookie(user)];
          this.user = u;
          this.resourceDemipath = "/index.html";
        }
      });
    }

    if (req.url.includes("/register?")) {
      this.resourceDemipath = "/index.html";
      this.isDynamic = true;
      const user = this.urlContent.searchParams.get("username");
      const fullName = this.urlContent.searchParams.get("fullname");
      const email = this.urlContent.searchParams.get("email");

      if (!this.dbUsers.some((u) => u.usuario == user)) {
        db.registerUser(user, fullName, email);
      }
      this.user = db.users.filter((u) => u.usuario == user)[0];
      this.headers["Set-Cookie"] = [`user=${user}`, db.getCartCookie(user)];
    }

    if (req.url.includes("/search?")) {
      this.ajax = "search";
      this.body = this.urlContent.searchParams.get("q");
      return;
    }

    if (req.url.includes("/toggle-theme")) {
      this.getUserFromCookie(req.headers.cookie);
      this.ajax = "theme";

      let updatedTheme = THEMES[(THEMES.indexOf(this.user.tema) + 1) % THEMES.length];
      if (req.headers.cookie) {
        const userCookie = this.getCookies(req.headers.cookie)["user"];
        db.updateUser(userCookie, { tema: updatedTheme });
      }
      db.isModified = true;

    }
    if (req.url.includes("/document.html?")) {
      this.getUserFromCookie(req.headers.cookie);
      if (!this.user) this.resourceDemipath = "/login.html";
      this.isDynamic = true;
      if (this.user && this.user.tema == "dark") this.isDarkTheme = true;
    }
    if (req.url.includes("/product.html?")) {
      this.getUserFromCookie(req.headers.cookie);
      if (!this.user) this.resourceDemipath = "/login.html";
      this.isDynamic = true;
    }
    if (req.url.includes("/new-order?")) {
      this.body = {
        mail: this.urlContent.searchParams.get("mail"),
        card: this.urlContent.searchParams.get("card"),
      };
      this.ajax = "new-order";
      this.getUserFromCookie(req.headers.cookie);
      this.cart = this.getCookies(req.headers.cookie)["cart"];
    }
  }
  // METODOS DE LA CLASE \\

  /**
   * @method getCookies
   * @param {string} cookie - Cadena de cookies.
   * @returns {object} - Objeto con las cookies.
   */
  getCookies = (cookie) => {
    return cookie.split(";").reduce((cookies, c) => {
      const [name, value] = c.trim().split("=");
      cookies[name] = value || "";
      return cookies;
    }, {});
  };

  /**
   * @method getUserFromCookie
   * @param {string} cookie - Cadena de cookies.
   * @description
   * Busca el usuario en las cookies y lo asigna a la propiedad user.
   * @returns {void}
   */
  getUserFromCookie = (cookie) => {
    if (cookie) {
      const userCookie = this.getCookies(cookie)["user"];
      if (!userCookie) return null;
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) this.user = u;
      });
    }
  };

  /**
   * @method recievePostData
   * @param {object} req - Objeto de la petición HTTP.
   * @description
   * Recibe los datos de la petición POST y los almacena en la propiedad body.
   * @returns {void}
   */
  recievePostData = async (req) => {
    this.getUserFromCookie(req.headers.cookie);
    if (!this.user) {
      this.resourceDemipath = "/login.html";
      this.isDynamic = true;
      return;
    }
    req.on("data", (chunk) => {
      this.body += chunk.toString();
    });
    await new Promise((resolve) => {
      req.on("end", () => {
        //-- Peticiones POST --//
        if (req.method == "POST") {
          if (this.resourceDemipath.includes("/add-to-cart?")) {
            this.ajax = "add-to-cart";
            this.type = this.urlContent.searchParams.get("type");
            this.getUserFromCookie(req.headers.cookie);
          }
          resolve();
        }
      });
    });
  };
}
export default RequestAnalyser;

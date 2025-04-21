import { get } from "http";
import url from "url";
const URL = url.URL;
//------------------------------------- Request Analysis ----------------------

class RequestAnalyser {
  constructor(req, users) {
    this.dbUsers = users;
    this.resourceDemipath = req.url;
    this.headers = {};
    this.user = null;
    this.body = "";
    this.ajax = null;
    this.isDynamic = false;
    this.isDarkTheme = false;

    this.urlContent = new URL(req.url, `http://${req.headers.host}`);

    //-- Cambios inmediatos --//

    switch (req.url) {
      case "/":
        this.resourceDemipath = "/index.html";
      case "/index.html":
        this.getUserFromCookie(req.headers.cookie);
        if (!this.user) this.resourceDemipath = "/login.html";
        this.isDynamic = true;
        if (this.user && this.user.tema == "dark") this.isDarkTheme = true;
        break;
    }
    //-- Peticiones Get --//
    if (req.url.includes("/login?")) {
      this.isDynamic = true;
      this.resourceDemipath = "/login.html"; // TODO : Si el usuario no existe, debe notificarse el error
      const user = this.urlContent.searchParams.get("username");
      this.dbUsers.forEach((u) => {
        if (u.usuario == user) {
          this.headers["Set-Cookie"] = [`user=${user}`]; //! OJO: Esto solo funciona si no hay mas cookies
          this.user = u;
          this.resourceDemipath = "/index.html";
          if (u.tema == "dark") {
            this.isDarkTheme = true;
          }
        }
      });
    }

    if (req.url.includes("/logout")) {
      this.resourceDemipath = "/login.html";
      this.isDynamic = true;
      this.headers["Set-Cookie"] = [`user=;`]; //! OJO: Si aumentan los campos de la cookie, hay que tenerlos en cuenta
      this.user = null;
      this.isDarkTheme = false;
    }

    if (req.url.includes("/register?")) {
      // TODO No es muy coherente con la clase
      // ! FALTA CONTROLAR EL TEMAAAA
      this.resourceDemipath = "/index.html";
      this.isDynamic = true;
      const user = this.urlContent.searchParams.get("userName");
      const fullName = this.urlContent.searchParams.get("fullName");
      const email = this.urlContent.searchParams.get("email");

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
    if (req.url.includes("/search?")) {
      this.ajax = "search";
      this.body = this.urlContent.searchParams.get("q");
      return;
    }

    if (req.url.includes("/toggle-theme")) {
      this.getUserFromCookie(req.headers.cookie);
      if (!this.user) {
        this.resourceDemipath = "/login.html";
        this.isDynamic = true;
        return;
      }
      this.ajax = "theme";
      let updatedTheme = this.user.tema == "dark" ? "default" : "dark";
      this.setUserPropsFromCookie(req.headers.cookie, { tema: updatedTheme });
      if (this.user.tema == "dark") this.isDarkTheme = true;
    }
    if (req.url.includes("/document.html")) {
      this.getUserFromCookie(req.headers.cookie);
      if (!this.user) this.resourceDemipath = "/login.html";
      this.isDynamic = true;
      if (this.user && this.user.tema == "dark") this.isDarkTheme = true;
    }
    if (req.url.includes("/product.html")) {
      this.getUserFromCookie(req.headers.cookie);
      if (!this.user) this.resourceDemipath = "/login.html";
      this.isDynamic = true;
    }
  }

  getUserFromCookie = (cookie) => {
    //! Si da tiempo molaría una gestión de cookies más robusta
    if (cookie) {
      const userCookie = cookie.split(";")[1].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) this.user = u;
      });
    }
  };

  setUserPropsFromCookie = (cookie, userProps) => {
    if (cookie) {
      //! Si da tiempo molaría una gestión de cookies más robusta
      const userCookie = cookie.split(";")[1].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) {
          if (u.usuario == userCookie) {
            u.usuario = userProps.usuario || u.usuario;
            u.nombre = userProps.nombre || u.nombre;
            u.email = userProps.email || u.email;
            u.tema = userProps.tema || u.tema;
            this.user = u;
          }
        }
      });
    }
  };

  recievePostData = async (req) => {
    this.getUserFromCookie(req.headers.cookie);
    if (!this.user) {
      this.resourceDemipath = "/login.html";
      this.isDynamic = true;
      return;
    }
    req.on("data", (chunk) => {
      //! Mucho me temo que esto podría ser un cabo suelto
      this.body += chunk.toString();
    });
    await new Promise((resolve) => {
      req.on("end", () => {
        //-- Peticiones POST --//
        if (req.method == "POST") {
          console.log(this.body);
          if (this.resourceDemipath.includes("/add-to-cart?")) {
            this.ajax = "cart";
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

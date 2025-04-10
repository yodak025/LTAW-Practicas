//------------------------------------- Request Analysis ----------------------

class RequestAnalyser {
  constructor(req, users) {
    this.dbUsers = users;
    this.resourceDemipath = req.url;
    this.headers = {};
    this.user = null;
    this.body = "";
    this.isAjax = false;
    this.isDynamic = false;
    this.isDarkTheme = false;

    //-- Cambios inmediatos --//

    switch (req.url) {
      case "/":
        this.resourceDemipath = "/index.html";
      case "/index.html":
      case "/product.html":
        this.getUserFromCookie(req.headers.cookie);
        if (!this.user) this.resourceDemipath = "/login.html";
        this.isDynamic = true;
        if (this.user && this.user.tema == "dark") this.isDarkTheme = true;
        break;
    }
    //-- Peticiones Get --//
    if (req.url.includes("/login?")) {
      this.resourceDemipath = "/login.html"; // TODO : Si el usuario no existe, debe notificarse el error
      const user = req.url.split("?")[1].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == user) {
          this.headers["Set-Cookie"] = [`user=${user}`]; //! OJO: Esto solo funciona si no hay mas cookies
          this.resourceDemipath = "/index.html";
          if (u.tema == "dark") {
            this.isDarkTheme = true;
          }
        }
      });
    }

    if (req.url.includes("/register?")) {
      // TODO No es muy coherente con la clase
      // ! FALTA CONTROLAR EL TEMAAAA
      this.resourceDemipath = "/index.html";
      const registerData = req.url.split("?")[1].split("&");
      const user = registerData[0].split("=")[1];
      const fullName = registerData[1].split("=")[1];
      const email = registerData[2].split("=")[1];

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

    if (req.url.includes("/update-theme?")) {
      const updatedTheme = req.url.split("?")[1].split("=")[1];
      this.setUserPropsFromCookie(req.headers.cookie, { tema: updatedTheme });
      if (this.user.tema == "dark") this.isDarkTheme = true;
    }
    if (req.url.includes("/document.html")) {
      this.isDynamic = true;
    }
    

  }

  getUserFromCookie = (cookie) => {
    if (cookie) {
      const userCookie = cookie.split(";")[0].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) this.user = u;
      });
    }
  };

  setUserPropsFromCookie = (cookie, userProps) => {
    if (cookie) {
      const userCookie = cookie.split(";")[0].split("=")[1];
      this.dbUsers.forEach((u) => {
        if (u.usuario == userCookie) {
          if (u.usuario == userCookie) {
            this.user = u;
            u.usuario = userProps.usuario || u.usuario;
            u.nombre = userProps.nombre || u.nombre;
            u.email = userProps.email || u.email;
            u.tema = userProps.tema || u.tema;
          }
        }
      });
    }
  };
  recievePostData = async (req) => {
    req.on("data", (chunk) => {
      //! Mucho me temo que esto podría ser un cabo suelto
      this.body += chunk.toString();
    });
    await new Promise((resolve) => {
      req.on("end", () => {
        //-- Peticiones POST --//
        if (req.method == "POST") {
          console.log(this.body);
          //this.body = JSON.parse(this.body);
          switch (this.resourceDemipath) {
            case "/generate-document":
              this.isAjax = true
              resolve();
              break;
          }
        }
      })
    });
  }
}
export default RequestAnalyser;
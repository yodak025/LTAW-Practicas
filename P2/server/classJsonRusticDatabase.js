import fs from "fs";
import colors from "colors";

//--------------------------------------- AUX FUNCTIONS ---------------------

/**
 * @function normalizeString
 * @param {string} str - Cadena a normalizar
 * @returns {string} - Cadena normalizada
 */

function normalizeString(str) {
  return str
    .normalize("NFD") // Separa los caracteres acentuados. Ejemplo: á -> a + ́
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/\s+/g, "") // Elimina todos los espacios
    .replace(/[^\w]/g, "") // Elimina caracteres no alfanuméricos como signos de puntuación
    .toLowerCase(); // Convierte a minúsculas
}

//------------------------------------- DATABASE ------------------------------

/**
 * @class JsonRusticDatabase
 * @classdesc Clase para manejar la base de datos JSON de la tienda.
 */
class JsonRusticDatabase {
  /**
   * @constructor
   * @param {string} path - Ruta del archivo JSON de la base de datos.
   * @description
   * Constructor de la clase JsonRusticDatabase.
   * Inicializa la ruta del archivo y las propiedades de la base de datos.
   */
  constructor(path) {
    this.path = path;
    this.users = undefined;
    this.products = undefined;
    this.orders = undefined;
    this.isModified = false;
  }

  /**
   * @method readDatabase
   * @description
   * Lee la base de datos desde el archivo JSON.
   */
  readDatabase = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, "utf-8", (err, data) => {
        console.log("\nLeyendo base de datos...".bgWhite);
        if (err) {
          console.error("\nError al leer el archivo JSON:\n".bgRed, err);
          reject(err);
        } else {
          try {
            const jsonData = JSON.parse(data);
            this.users = jsonData.usuarios;
            this.products = jsonData.productos;
            this.orders = jsonData.pedidos;
            console.log("\nBase de datos leída correctamente.\n".bgGreen);
            resolve();
          } catch (parseError) {
            console.error("\nError al analizar el JSON:\n".bgRed, parseError);
            reject(parseError);
          }
        }
      });
    });
  };

  /**
   * @method writeDatabase
   * @description
   * Escribe la base de datos en el archivo JSON.
   */
  writeDatabase = () => {
    // ? En solución a un bug terrible de concurrencia de tareas,
    // ? el desarrollador ha optado por bloquear el hilo de ejecución
    // ? mientras se escribe la base de datos, lo que no es óptimo
    // ? y representa una decisión realmente cobarde.
    // ? No obstante, la escrutura se realiza de forma periódica
    // ? solo ante cambios en la base de datos, por lo que no debería
    // ? afectar al rendimiento de la aplicación.

    fs.writeFileSync(
      this.path,
      JSON.stringify(
        {
          usuarios: this.users,
          productos: this.products,
          pedidos: this.orders,
        },
        null,
        2
      ),
      (err) => {
        isWriting = false;
        if (err) {
          console.error("\nError al escribir el archivo JSON:\n".bgRed, err);
          reject(err);
        } else {
          console.log("\nBase de datos actualizada correctamente.\n".bgGreen);
          resolve();
        }
      }
    );
  };

  /**
   * @method registerUser
   * @param {string} user - Nombre de usuario.
   * @param {string} fullName - Nombre completo del usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @returns {void}
   * @description
   * Añade un nuevo usuario a la base de datos.
   */
  registerUser = (user, fullName, email) => {
    this.isModified = true;
    this.users.push({
      usuario: user,
      nombre: fullName,
      email: email,
      tema: "default",
      carrito: [],
    });
  }

  /**
   * @method updateUser
   * @param {string} userCookie - Nombre de usuario extraido de la cookie.
   * @param {object} userProps - Propiedades del usuario a actualizar.
   * @returns {void}
   * @description
   *  Busca un usuario en la base de datos y, si lo encuentra, actualiza sus propiedades.
   */
  updateUser = (userCookie, userProps) => {
    if (!userCookie) return;
    this.users.forEach((u) => {
      if (u.usuario == userCookie) {
        u.usuario = userProps.usuario || u.usuario;
        u.nombre = userProps.nombre || u.nombre;
        u.email = userProps.email || u.email;
        u.tema = userProps.tema || u.tema;
        this.user = u;
        this.isModified = true;
      }
    });
  };

  /**
   * @method addNewOrder
   * @param {array} orders - Array de objetos con los productos del pedido.
   * @param {string} userName - Nombre de usuario.
   * @param {string} mail - Correo electrónico del usuario.
   * @param {string} card - Número de tarjeta del usuario.
   * @returns {void}
   * @description
   * Añade un nuevo pedido a la base de datos.
   */
  addNewOrder = (orders, userName, mail, card) => {
    this.isModified = true;
    const newOrder = {
      usuario: userName,
      fecha: new Date().toISOString(),
      dirección: mail,
      tarjeta: card,
      documentos: [],
    };
    orders.forEach((order) => {
      newOrder.documentos.push({
        tipo: order.type,
        cuerpo: order.body,
      });
    });
    this.orders.push(newOrder);
    this.users.filter((u) => u.usuario == userName)[0].carrito = []; // Vaciar el carrito del usuario
  };

  /**
   * @method findProductsByDemiName
   * @param {string} demiName - Nombre del producto a buscar.
   * @returns {array} - Array de productos que coinciden con el nombre.
   */
  findProductsByDemiName = (demiName) => {
    return this.products.filter((product) =>
      normalizeString(product.titulo).includes(normalizeString(demiName))
    );
  };

  /**
   * @method addOrderToCart
   * @param {object} reqData - Datos de la orden a añadir al carrito.
   * @returns {void}
   * @description
   * Añade una orden al carrito del usuario.
   */
  addOrderToCart = (reqData) => {
    this.isModified = true;
    const order = {
      tipo: reqData.type,
      cuerpo: reqData.body,
    };

    this.users
      .filter((u) => u.usuario == reqData.user.usuario)[0]
      .carrito.push(order);
  };

  /**
   * @method updateCart
   * @param {object} reqData - Datos del carrito a actualizar.
   * @returns {string} - Cookie del carrito actualizado.
   * @description 
   * Actualiza el carrito del usuario en la base de datos.
   */

  updateCart = (reqData) => {
    this.isModified = true;
    const user = this.users.filter((u) => u.usuario == reqData.user.usuario)[0];
    let newCart = [];
    const dbCart = user.carrito;
    if (!reqData.cart) {
      user.carrito = [];
    } else {
      const cookieCart = reqData.cart.split("&").reduce((acc, order) => {
        const [id, type] = order.split(":");
        acc[id] = type;
        return acc;
      }, {});
      dbCart.forEach((order, index) => {
        if (order.tipo == cookieCart[`product${index}`]) {
          newCart.push(order);
        }
      });
      user.carrito = newCart;
    }
    return this.getCartCookie(user.usuario);
  };

  /**
   * @method getCartCookie
   * @param {string} user - Nombre de usuario.
   * @returns {string} - Cookie del carrito del usuario.
   */
  getCartCookie = (user) => {
    const cart = this.users.filter((u) => u.usuario == user)[0].carrito;
    let cartCookie = "cart=";
    if (cart.length == 0) return cartCookie + ";";
    cart.forEach((order, index) => {
      cartCookie += `product${index}:${order.tipo}&`;
    });
    return cartCookie.slice(0, -1) + ";";
  };

  /**
   * @method getDocumentAbsoluteIndexesFromUser
   * @param {string} userName - Nombre de usuario.
   * @returns {array} - Array de índices absolutos de los documentos del usuario.
   * @description
   * Obtiene los índices absolutos de los documentos del usuario en la base de datos,
   * teniendo en cuenta el número de documentos de los pedidos anteriores.
   */
  getDocumentAbsoluteIndexesFromUser = (userName) => {
    let currentIndex = 0;
    let indexes = [];
    this.orders.forEach((order) => {
      if (order.usuario == userName) {
        order.documentos.forEach((doc) => {
          indexes.push(currentIndex);
          currentIndex++;
        });
      } else {
        currentIndex += order.documentos.length;
      }
    });
    return indexes;
  };

  /**
   * @method getDocumentFromAbsoluteIndex
   * @param {number} index - Índice absoluto del documento.
   * @returns {object} - Objeto con el documento y la fecha del pedido.
   * @description
   * Obtiene el documento correspondiente al índice absoluto en la base de datos.
   */
  getDocumentFromAbsoluteIndex = (index) => {
    let currentIndex = 0;
    for (const order of this.orders) {
      if (currentIndex + order.documentos.length > index) {
        return {
          doc: order.documentos[index - currentIndex],
          date: order.fecha,
        };
      }
      currentIndex += order.documentos.length;
    }
    console.error(
      "\nError: No se ha encontrado el documento con el índice absoluto:\n".red,
      index
    );
  };
}

export default JsonRusticDatabase;

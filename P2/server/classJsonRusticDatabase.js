import fs from "fs";
import colors from "colors";

//--------------------------------------- AUX FUNCTIONS ---------------------
function normalizeString(str) {
  return str
    .normalize("NFD") // Separa los caracteres acentuados. Ejemplo: á -> a + ́
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/\s+/g, "") // Elimina todos los espacios
    .replace(/[^\w]/g, "") // Elimina caracteres no alfanuméricos como signos de puntuación
    .toLowerCase(); // Convierte a minúsculas
}

//------------------------------------- DATABASE ------------------------------
// ! la base de datos da errores de lectura y escritura y no sabemos por qué

class JsonRusticDatabase {
  constructor(path) {
    this.path = path;
    this.users = undefined;
    this.products = undefined;
    this.orders = undefined;
  }

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
  writeDatabase = () => {
    // ? En solución a un bug terrible de concurrencia de tareas,
    // ? el desarrollador ha optado por bloquear el hilo de ejecución
    // ? mientras se escribe la base de datos, lo que no es óptimo
    // ? y representa una decisión realmente cobarde, pero es lo que hay.

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

  addNewOrder = (order, userName, documentType) => {
    const newOrderID = this.orders.length;
    const newOrder = {
      usuario: userName.usuario,
      tipo: documentType,
      estructura: order,
    };
    this.orders.push(newOrder);
    return newOrderID;
  };

  findProductsByDemiName = (demiName) => {
    return this.products.filter((product) =>
      normalizeString(product.titulo).includes(normalizeString(demiName))
    );
  };

  addOrderToCart = (reqData) => {
    const order = {
      tipo: reqData.type,
      cuerpo: reqData.body,
    };

    this.users
      .filter((u) => u.usuario == reqData.user.usuario)[0]
      .carrito.push(order);
  };

  getCartCookie = (user) => {
    const cart = this.users.filter((u) => u.usuario == user)[0].carrito;
    let cartCookie = "cart=";
    cart.forEach((order, index) => {
      cartCookie += `product${index + 1}:${order.tipo}&`;
    });
    return cartCookie.slice(0, -1) + ";";
  };
}

export default JsonRusticDatabase;

import fs from "fs";

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
        if (err) {
          console.error("Error al leer el archivo JSON:", err);
          reject(err);
        } else {
          try {
            const jsonData = JSON.parse(data);
            this.users = jsonData.usuarios;
            this.products = jsonData.productos;
            this.orders = jsonData.pedidos;
            console.log("Base de datos leída correctamente.");
            resolve();
          } catch (parseError) {
            console.error("Error al analizar el JSON:", parseError);
            reject(parseError);
          }
        }
      });
    });
  };
  writeDatabase = () => {
    // ? En solución a un bug terrible de concurrencia de tareas,
    // ? el desarrollador ha optado por bloquear el hilo de ejecución
    // ? mientras se escribe la base de datos, lo cual no es óptimo
    // ? y representa una decisión de puto cobarde, pero es lo que hay.

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
          console.error("Error al escribir el archivo JSON:", err);
          reject(err);
        } else {
          console.log("Base de datos actualizada correctamente.");
          resolve();
        }
      }
    );
  };

  addNewOrder = (order) => {
    const newOrderID = this.orders.length;
    const newOrder = { id: newOrderID, content: order }; //! Es redundante que el id esté dentro del contenido
    this.orders.push(newOrder);
    return newOrderID;
  }
}

export default JsonRusticDatabase;

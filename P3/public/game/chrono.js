/**
 * @fileoverview Implementación de un cronómetro para medir el tiempo transcurrido
 */

/**
 * @class Crono
 * @description Clase que implementa un cronómetro con precisión de centésimas de segundo
 */
class Crono {

    /**
     * @constructor
     * @description Inicializa un nuevo cronómetro a cero
     */
    constructor() {

        // Tiempo
        this.cent = 0, // Centésimas
        this.seg = 0,  // Segundos
        this.min = 0,  // Minutos
        this.timer = null;  // Temporizador asociado

        this.disp = "0:0:0";
    }    /**
     * @method _tic_
     * @description Método interno que se ejecuta cada centésima para actualizar el tiempo
     * @private
     */
    _tic_() {
        // Incrementar en una centésima
        this.cent += 1;

        // 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        // 60 segundos hacen un minuto
        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;        }

        // Mostrar el valor actual
        this.disp = "0:" + this.min + ":" + this.seg
    }

    /**
     * @method start
     * @description Arranca el cronómetro si no está en marcha
     */
    start() {
       if (!this.timer) {
          // Lanzar el temporizador para que llame 
          // al método tic cada 10ms (una centésima)
          this.timer = setInterval( () => {
              this._tic_();
          }, 10);
        }
    }

    /**
     * @method stop
     * @description Detiene el cronómetro si está en marcha
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }    /**
     * @method reset
     * @description Reinicia el cronómetro a cero
     */
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;

        this.disp = "0:0:0";
    }
}
// --------------------------- Canvas Element Class --------------------------- //
// ? Todo comienza con la clase Canvas Element. Será la base para todos los objetos
// ? que se dibujen en el canvas. Esta clase tiene métodos para dibujar, limpiar y calcular.

export class CanvasElement {
  constructor(canvas_id, id = null, pos) {
    this._ASPECT_RATIO = null; //! Parece que se inicializa a lo tonto

    if (id != null) {
      this.tex = document.getElementById(id);
    }

    this._canvas_id_ = canvas_id; //! Parece que solo se usa para el id del canvas.
    this._id_ = id;

    this._canvas_ = document.getElementById(this._canvas_id_);
    this._ASPECT_RATIO = this._canvas_.width / this._canvas_.height;

    this.is_dead = false; //! JS no usa snake_case

    this._position_ = {
      //! Esto es una chapuza galaxial probablemente
      x: pos[0],
      y: pos[1],
      cx: pos[4],
      cy: pos[5],
    };

    this._size_ = {
      //? Refiere a las dimensiones del objeto y del colider
      width: pos[2],
      height: pos[3],
    };

    this._ctx_ = this._canvas_.getContext("2d"); //! no se hasta que punto es privado
  }

  //? Esta función se llama cada vez que se cambia el tamaño de la ventana.
  _recalc_window_() {
    this._canvas_.width = window.innerWidth;
    this._canvas_.height = window.innerHeight;
    this._ASPECT_RATIO = this._canvas_.width / this._canvas_.height;
  }
  //? Esta movida es para garantizar la relación de aspecto en los objetos.
  //! Mucho ojo con esta mierda, porque los coliders van de culo y esto parece de cuando programaba
  //! A base de canutos y no tenía ningún miedo al exito.
  _reaxe_(k, axis = "x", type = "default") {
    //! lo del type es una chapuza mayuscula y no cabe replica
    switch (type) {
      case "resize":
        switch (axis) {
          case "x":
            return [(this._canvas_.width * k) / this._ASPECT_RATIO];
          case "y":
            return [this._canvas_.height * k];
        }

      case "lb_corner":
        switch (axis) {
          case "x":
            return [
              this._canvas_.width * k[0] -
                this._reaxe_(k[1] / 2, "x", "resize"), //! ??? Es recursiva? Lo que es el Tetrahidrocanabinol...
            ];
          case "y":
            return [
              this._canvas_.height * (1 - k[0]) -
                this._reaxe_(k[1] / 2, "y", "resize"),
            ];
        }

      case "rh_corner":
        switch (axis) {
          case "x":
            return [
              this._canvas_.width * k[0] +
                this._reaxe_(k[1] / 2, "x", "resize"),
            ];
          case "y":
            return [
              this._canvas_.height * (1 - k[0]) +
                this._reaxe_(k[1] / 2, "y", "resize"),
            ];
        }

      default:
        switch (axis) {
          case "x":
            return [this._canvas_.width * k];
          case "y":
            return [this._canvas_.height * k];
        }
    }
  }
  //? limpia el canvas y recalcula la ventana. El fondo de pantalla se genera a nivel de css
  //! El fondo de pantalla es a nivel de css. Potencial fuente de dolor de cabeza.
  clear() {
    this._ctx_.clearRect(0, 0, this._canvas_.width, this._canvas_.height);
    this._recalc_window_();
  }

  draw(type = "rectangle") {
    //! Mucho type veo yo por aquí. Menos THC y más DRY.
    if (this.is_dead) {
      //!  Si esta muerto no lo llames animal
      return;
    }

    switch (type) {
      case "rectangle":
        this._ctx_.beginPath();

        this._ctx_.rect(
          this._reaxe_(
            [this._position_.x, this._size_.width],
            "x",
            "lb_corner"
          ),
          this._reaxe_(
            [this._position_.y, this._size_.height],
            "y",
            "lb_corner"
          ),
          this._reaxe_(this._size_.width, "x", "resize"),
          this._reaxe_(this._size_.height, "y", "resize")
        );

        this._ctx_.fillStyle = "green";

        this._ctx_.fill();

        this._ctx_.stroke();

        this._ctx_.closePath();
        this._ctx_.save();

        break;

      case "image":
        this._ctx_.drawImage(
          this.tex,
          this._reaxe_(
            [this._position_.x, this._size_.width],
            "x",
            "lb_corner"
          ),
          this._reaxe_(
            [this._position_.y, this._size_.height],
            "y",
            "lb_corner"
          ),
          this._reaxe_(this._size_.width, "x", "resize"),
          this._reaxe_(this._size_.height, "y", "resize")
        );
        break;
    }
  }
  //! Lo del sistema de coordenadas es un major problem.
  //! Colider es un nombre de mierda
  colider() {
    let lbx = this._position_.x - this._position_.cx / 2;
    let lby = this._position_.y - this._position_.cy / 2;
    let rbx = this._position_.x + this._position_.cx / 2;
    let rby = this._position_.y + this._position_.cy / 2;

    let x = [lbx, rbx];
    let y = [lby, rby];
    let _obj = this; //! Khé?

    return [x, y, _obj];
  }
}
//? Pilla la clase Crono de Jesus Parrado y monta un cronometro
//? y un marcador de puntuacion sobre un CanvasElement.
// Esto igual se puede quedar
export class TimeScore extends CanvasElement {
  constructor(canvas_id, id = null, pos = [0.5, 0.5, 0, 0]) {
    super(canvas_id, id, pos);
    this._time_ = new Crono();
    this._score_ = 0;
  }

  setTime() {
    this._time_.start();

    this._ctx_.font = "23px Arial";
    this._ctx_.fillStyle = "black";

    this._ctx_.fillText(
      String(this._score_) + "    " + this._time_.disp,
      this._reaxe_([this._position_.x, this._size_.width], "x", "lb_corner"),
      this._reaxe_([this._position_.y, this._size_.height], "y", "lb_corner")
    );

    this._ctx_.fillStyle = "blue";
  }

  increaseScore() {
    this._score_ += 100;
  }
}

//? Esta clase es la que se encarga de manejar la piedra y su movimiento
//? recibe el id del canvas y el id de la piedra. También la posición y la gravedad para el colisioner
export class OneStone extends CanvasElement {
  // TODO ordenar los atributos en el constructor
  constructor(canvas_id, id = null, pos, grv) {
    super(canvas_id, id, pos);

    //! Hay que arreglar esto
    this._position_ = {
      x: pos[0],
      y: pos[1],
      x0: pos[0],
      y0: pos[1],
      cx: pos[4],
      cy: pos[5],
    };

    this._speed_ = {
      x: 0,
      y: 0,
    };

    this._MAX_BOINGS_ = 0;

    this._boings = 0;

    //? Clase encargada de controlar las colisiones y manejar algunos eventos
    //! Lo del colisioner igual se queda, pero aquí dentro? ni de coña
    this.colisioner = {
      x: [],
      y: [],
      objs: [],

      x0: [],
      y0: [],
      objs0: [],

      timeScore: null,

      len: 0,

      addTimeScore: function (ts) {
        //! Por que no se hace en el constructor?
        this.timeScore = ts;
      },

      clear: function () {
        this.x = [];
        this.y = [];
      },

      add: function (mat) {
        this.x.push(mat[0]);
        this.y.push(mat[1]);
        this.objs.push(mat[2]);
        this.len += 1;
      },

      add0: function (mat) {
        this.x0.push(mat[0]);
        this.y0.push(mat[1]);
        this.objs0.push(mat[2]);
      },

      is_colision: function (mat) {
        //! si no devuelve ni es un bool no empieza por is, y SEGUIMOS SIN ESTAR EN PYTHON
        //! Diego vaya nombres de mierda, que puñetas es mat?
        let isBorderX = false;
        let isBorderY = false;
        let colisionType = "";

        if (mat[0][0] < this.x0[0][0] || mat[0][1] > this.x0[0][1]) {
          isBorderX = true;
          colisionType = "edges";
        }

        if (mat[1][0] < this.y0[0][0] || mat[1][1] > this.y0[0][1]) {
          isBorderY = true;
          colisionType = "edges";
        }
        for (let i = 0; i < this.len; i++) {
          if (
            (((mat[0][0] > this.x[i][0]) & (mat[0][0] < this.x[i][1])) |
              ((mat[0][1] > this.x[i][0]) & (mat[0][1] < this.x[i][1]))) &
            (((mat[1][0] > this.y[i][0]) & (mat[1][0] < this.y[i][1])) |
              ((mat[1][1] > this.y[i][0]) & (mat[1][1] < this.y[i][1])))
          ) {
            isBorderX = true;
            isBorderY = true;
            if (!this.objs[i].is_dead) this.timeScore.increaseScore();

            this.objs[i].is_dead = true;
            colisionType = "object";
          }
        }

        return [isBorderX, isBorderY, colisionType];
      },
    };

    this._gravity_ = (-1 / 2) * grv;

    this.isStopped = false;
  }

  setDifficulty(diff) {
    //! Tío pero no era una constante? Menudo sinverguenza
    switch (diff) {
      case "easy":
        this._MAX_BOINGS_ = 15;
        break;
      case "hard":
        this._MAX_BOINGS_ = 5;
        break;
      case "insane":
        this._MAX_BOINGS_ = 1;
        break;
    }
  }

  setInitialSpeed(spd) {
    //! Por la cara. No te sabes la de los Magic Numbers? 0 automatico.
    this._speed_.x = 20 * spd[0];
    this._speed_.y = 42.9 * spd[1];
  }

  parabola(t) {
    if (this._boings > this._MAX_BOINGS_) {
      this.isStopped = true;
      return;
    }

    this._speed_.y += this._gravity_ * t;

    this._position_.x += this._speed_.x / 500;//! ese 500 se va fuera 
    this._position_.y += this._speed_.y / 500;//! y ese

    //? Aquí se determina si el colider de la piedra está colisionando con algo
    let is_colided = this.colisioner.is_colision(this.colider());

    switch (is_colided[2]) {
      case "edges":
        if (is_colided[0]) {
          this._speed_.x = -this._speed_.x;
          return;
        }
        if (is_colided[1]) {
          this._speed_.y = -this._speed_.y;
          this._boings += 1;
          return;
        }
      default:
        break;
    }
  }

  parabol(t, isOn) {
    //! Nice reference pero no sirve para nada
    if (isOn) {
      this.parabola(t);
    }
  }
}

export class Twobirds extends CanvasElement {
  constructor(canvas_id, id, pos) {
    super(canvas_id, null, pos);
    this._id_ = id;
    this.texs = [];

    for (let i = 0; i < 6; i++) {
      this.texs.push(document.getElementById(this._id_ + i));
    }
    this.__FRAMES__ = this.texs.length;
  }

  animate_bird(x) { //! No pasa nada pero estaría mejor algo un poco más sofisticado
    this.tex = this.texs[Math.trunc(x) % this.__FRAMES__];
    this.draw("image");
  }
}

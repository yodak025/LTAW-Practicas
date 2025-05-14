/**
 * @fileoverview Controlador de la interfaz de usuario que gestiona el estado y la creación de componentes UI.
 */
import {
  List,
  ArrowBack,
  Modal,
  Settings,
  AudioSettingContent,
  ToggleFullScreen,
} from "./components/index.js";

/**
 * @class UIController
 * @description Controla toda la interfaz de usuario del juego, incluyendo menús, modal y gestión de salas multijugador.
 */
export class UIController {
  /**
   * @constructor
   * @param {SocketIO.Socket} socket - Socket para la comunicación con el servidor
   */
  constructor(socket) {
    this.menuContainer = document.getElementById("menu");
    this.gameContainer = document.getElementById("game-container");
    this.socket = socket;
    this.selectedPlayerType = null;
    
    // Inicializar el volumen de audio
    this.audioVolume = localStorage.getItem('gameAudioVolume') ? 
      parseInt(localStorage.getItem('gameAudioVolume')) : 50;

    // Contenedor para controles UI durante el juego
    this.gameUIContainer = document.createElement("div");
    this.gameUIContainer.className = "game-ui-container";
    document.body.appendChild(this.gameUIContainer);
    
    // Referencia al controlador del juego
    this.gameController = null;
  }
  /**
   * @method showMainMenu
   * @description Muestra el menú principal con las opciones de juego
   */
  showMainMenu() {
    // Limpiar contenido del menú
    this.menuContainer.innerHTML = "";
    this.menuContainer.classList.remove("hidden");
    this.gameContainer.classList.add("hidden");

    // Añadir título
    const title = document.createElement("h1");
    title.textContent = "Kill Two Birds with One Stone";
    this.menuContainer.appendChild(title);

    // Crear opciones del menú
    const menuOptions = {
      "Un jugador": () => this.startSinglePlayerGame(),
      "Unirse a una sala": () => this.showJoinRoomMenu(),
      "Crear una sala": () => this.showCreateRoomMenu(),
      Ajustes: () => this.showSettings(),
    };

    // Crear y añadir componente lista
    const menuList = new List(menuOptions);
    this.menuContainer.appendChild(menuList.render());

    // Añadir botón de pantalla completa
    const fullscreenToggle = new ToggleFullScreen();
    this.menuContainer.appendChild(fullscreenToggle.render());
  }
  /**
   * @method startSinglePlayerGame
   * @async
   * @description Inicia el modo de juego para un solo jugador
   */
  async startSinglePlayerGame() {
    this.showGame();
    try {
      const module = await import("../singlePlayer.js");
      this.gameController = await module.initSinglePlayerMode(this.audioVolume);
    } catch (error) {
      console.error("Error loading single player game:", error);
    }
  }
  
  /**
   * @method setAudioVolume
   * @description Actualiza el volumen del audio del juego y lo guarda en localStorage
   * @param {number} volume - Valor del volumen (0-100)
   */
  setAudioVolume(volume) {
    this.audioVolume = volume;
    // Guardar en localStorage para persistencia
    localStorage.setItem('gameAudioVolume', volume);
    
    // Actualizar el volumen del juego en curso si existe
    if (this.gameController) {
      this.gameController.setMusicVolume(volume);
    }
  }
  /**
   * @method showJoinRoomMenu
   * @description Muestra el menú para unirse a una sala existente
   */
  showJoinRoomMenu() {
    // Limpiar contenido del menú
    this.menuContainer.innerHTML = "";

    // Añadir título
    const title = document.createElement("h2");
    title.textContent = "Unirse a una sala";
    this.menuContainer.appendChild(title);

    // Añadir botón de retroceso
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.menuContainer.appendChild(backButton.render());

    // Crear selección de rol
    const subtitle = document.createElement("h3");
    subtitle.textContent = "Selecciona tu rol:";
    this.menuContainer.appendChild(subtitle);

    const roleOptions = {
      "Jugar como Pájaro": () => {
        this.selectedPlayerType = "bird";
        this.loadRooms();
      },
      "Jugar como Piedra": () => {
        this.selectedPlayerType = "stone";
        this.loadRooms();
      },
    };

    // Create and append role list component
    const roleList = new List(roleOptions, "role-list");
    this.menuContainer.appendChild(roleList.render());
  }
  /**
   * @method loadRooms
   * @description Carga las salas disponibles desde el servidor
   */
  loadRooms() {
    // Eliminar lista previa de salas
    const existingRoomList = document.getElementById("room-list");
    if (existingRoomList) {
      existingRoomList.remove();
    }

    // Crear contenedor para la lista de salas
    const roomListContainer = document.createElement("div");
    roomListContainer.id = "room-list";
    roomListContainer.className = "room-list";
    this.menuContainer.appendChild(roomListContainer);

    // Solicitar salas al servidor
    this.socket.emit("getRooms");

    // Actualizar lista de salas cuando responda el servidor
    this.socket.on("roomList", (rooms) => {
      this.updateRoomList(rooms);
    });
  }
  /**
   * @method updateRoomList
   * @description Actualiza la lista de salas con los datos recibidos del servidor
   * @param {Array} rooms - Lista de salas disponibles
   */
  updateRoomList(rooms) {
    const roomListContainer = document.getElementById("room-list");
    if (!roomListContainer) return;

    // Limpiar contenido previo
    roomListContainer.innerHTML = "";

    if (rooms.length === 0) {
      const noRooms = document.createElement("p");
      noRooms.textContent = "No hay salas disponibles";
      roomListContainer.appendChild(noRooms);
      return;
    }    // Crear elementos para cada sala
    rooms.forEach((room) => {
      let statusText = "";
      let canJoin = false;

      if (this.selectedPlayerType === "bird") {
        if (room.hasBird) {
          statusText = "- Ocupado (pájaro)";
          canJoin = false;
        } else if (room.hasStone) {
          statusText = "- Disponible para pájaro";
          canJoin = true;
        } else {
          statusText = "- Vacía";
          canJoin = true;
        }
      } else {
        // stone
        if (room.hasStone) {
          statusText = "- Ocupado (piedra)";
          canJoin = false;
        } else if (room.hasBird) {
          statusText = "- Disponible para piedra";
          canJoin = true;
        } else {
          statusText = "- Vacía";
          canJoin = true;
        }
      }      // Crear elemento de sala
      const roomItem = document.createElement("div");
      roomItem.className = "room-item";

      // Nombre de la sala y estado
      const roomName = document.createElement("span");
      roomName.textContent = `${room.name} ${statusText}`;
      roomItem.appendChild(roomName);

      // Botón para unirse
      const joinButton = document.createElement("button");
      joinButton.textContent = "Unirse";
      joinButton.disabled = !canJoin;

      if (canJoin) {
        joinButton.onclick = () => {
          this.socket.emit("joinRoom", {
            roomName: room.name,
            playerType: this.selectedPlayerType,
          });
        };
      }

      roomItem.appendChild(joinButton);
      roomListContainer.appendChild(roomItem);
    });
  }
  /**
   * @method showCreateRoomMenu
   * @description Muestra el menú para crear una nueva sala
   */
  showCreateRoomMenu() {
    // Limpiar contenido del menú
    this.menuContainer.innerHTML = "";

    // Añadir título
    const title = document.createElement("h2");
    title.textContent = "Crear una sala";
    this.menuContainer.appendChild(title);

    // Añadir botón de retroceso
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.menuContainer.appendChild(backButton.render());    // Crear formulario de sala
    const createRoomForm = document.createElement("div");
    createRoomForm.className = "create-room-form";

    // Campo para el nombre de la sala
    const roomNameInput = document.createElement("input");
    roomNameInput.type = "text";
    roomNameInput.id = "room-name";
    roomNameInput.placeholder = "Nombre de la sala";
    createRoomForm.appendChild(roomNameInput);

    // Título para la selección de rol
    const roleTitle = document.createElement("h3");
    roleTitle.textContent = "Selecciona tu rol:";
    createRoomForm.appendChild(roleTitle);

    // Botones para selección de rol
    const roleButtons = document.createElement("div");
    roleButtons.className = "role-buttons";

    const birdButton = document.createElement("button");
    birdButton.id = "bird-role";
    birdButton.textContent = "Jugar como Pájaro";
    birdButton.onclick = () => {
      this.selectedPlayerType = "bird";
      createButton.disabled = false;
    };

    const stoneButton = document.createElement("button");
    stoneButton.id = "stone-role";
    stoneButton.textContent = "Jugar como Piedra";
    stoneButton.onclick = () => {
      this.selectedPlayerType = "stone";
      createButton.disabled = false;
    };

    roleButtons.appendChild(birdButton);
    roleButtons.appendChild(stoneButton);
    createRoomForm.appendChild(roleButtons);    // Botón para crear la sala
    const createButton = document.createElement("button");
    createButton.id = "create-room-btn";
    createButton.textContent = "Crear Sala";
    createButton.disabled = true;
    createButton.onclick = () => {
      const roomName = roomNameInput.value.trim();
      if (roomName && this.selectedPlayerType) {
        this.socket.emit("createRoom", {
          roomName,
          playerType: this.selectedPlayerType,
        });
      }
    };

    createRoomForm.appendChild(document.createElement("br"));
    createRoomForm.appendChild(createButton);

    this.menuContainer.appendChild(createRoomForm);
  }
  /**
   * @method showSettings
   * @description Muestra el menú de ajustes
   * @param {boolean} inModal - Determina si se muestra en un modal o no
   * @returns {HTMLElement|undefined} - Retorna el contenedor de ajustes si es modal
   */
  showSettings(inModal = false) {
    // Crear contenedor de ajustes
    const settingsContainer = document.createElement("div");
    settingsContainer.className = "settings-container";

    // Añadir título
    const title = document.createElement("h2");
    title.textContent = "Ajustes";
    settingsContainer.appendChild(title);

    // Si no está en modal, añadir botón de retroceso
    if (!inModal) {
      const backButton = new ArrowBack(() => this.showMainMenu());
      settingsContainer.appendChild(backButton.render());
    }    // Añadir ajustes de audio con el volumen actual
    const audioSettings = new AudioSettingContent((value) => {
      this.setAudioVolume(value);
    });
    // Establecer el valor actual del volumen
    audioSettings.update({ value: this.audioVolume });
    settingsContainer.appendChild(audioSettings.render());

    if (inModal) {
      return settingsContainer;
    } else {
      // Clear menu content and add settings
      this.menuContainer.innerHTML = "";
      this.menuContainer.appendChild(settingsContainer);
    }
  }
  /**
   * @method showGame
   * @description Muestra la interfaz del juego y oculta el menú
   */
  showGame() {
    this.menuContainer.innerHTML = ""; // Limpiar contenido del menú
    this.menuContainer.classList.add("hidden");
    this.gameContainer.classList.remove("hidden");

    // Añadir botón de ajustes a la UI del juego
    const settingsButton = new Settings(() => this.showGameMenu());
    this.gameUIContainer.innerHTML = ""; // Limpiar UI previa
    this.gameUIContainer.appendChild(settingsButton.render());

    // Añadir botón de pantalla completa a la UI del juego
    const fullscreenToggle = new ToggleFullScreen();
    this.gameUIContainer.appendChild(fullscreenToggle.render());

    // Redimensionar canvas para el juego
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }
  /**
   * @method showGameMenu
   * @description Muestra el menú interno del juego con opciones
   */
  showGameMenu() {
    // Crear modal con opciones del menú del juego
    const menuOptions = {
      "Reanudar partida": () => {
        document.getElementById("game-modal")?.remove();
      },
      Ajustes: () => {
        document.getElementById("game-modal")?.remove();
        const arrowBack = new ArrowBack(() => {
          document.getElementById("settings-modal")?.remove();
          this.showGameMenu();
        });
        const backButton = arrowBack.render();
        const settingsContent = this.showSettings(true);
        const renderedSettings = document.createElement("div");
        renderedSettings.appendChild(settingsContent);
        renderedSettings.appendChild(backButton);
        const settingsModal = new Modal(renderedSettings, "settings-modal");
        document.body.appendChild(settingsModal.render());
      },
      "Menú principal": () => {
        document.getElementById("game-modal")?.remove();
        //this.showMainMenu();
        //! Arriba, la solución correcta. Abajo, la chapuza que funciona
        window.location.reload();
      },
    };    // Crear componente de lista para el modal
    const menuList = new List(menuOptions);
    const modal = new Modal(menuList.render(), "game-modal");
    document.body.appendChild(modal.render());
  }
  /**
   * @method showGameResult
   * @description Muestra el resultado del juego (victoria o derrota)
   * @param {boolean} isVictory - Indica si el resultado es victoria (true) o derrota (false)
   */
  showGameResult(isVictory) {
    // Crear contenido para el modal
    const resultContainer = document.createElement("div");
    resultContainer.className = "game-result-container";
    
    // Añadir título del resultado
    const resultTitle = document.createElement("h2");
    resultTitle.className = isVictory ? "victory-title" : "defeat-title";
    resultTitle.textContent = isVictory ? "¡Victoria!" : "Derrota";
    resultContainer.appendChild(resultTitle);
      // Añadir mensaje del resultado
    const resultMessage = document.createElement("p");
    resultMessage.className = "result-message";
    resultMessage.textContent = isVictory 
      ? "¡Has ganado la partida!" 
      : "Has perdido la partida...";
    resultContainer.appendChild(resultMessage);
    
    // Añadir botón para volver al menú principal
    const menuButton = document.createElement("button");
    menuButton.className = "ui-button result-button";
    menuButton.textContent = "Volver al Menú Principal";
    menuButton.onclick = () => {
      document.getElementById("game-result-modal")?.remove();
      //this.showMainMenu();
      //! Arriba, la solución correcta. Abajo, la chapuza que funciona
      window.location.reload();
    };
    resultContainer.appendChild(menuButton);
      // Crear y mostrar modal
    const modal = new Modal(resultContainer, "game-result-modal");
    document.body.appendChild(modal.render());
  }
  /**
   * @method setupSocketHandlers
   * @description Configura los manejadores de eventos del socket
   */
  setupSocketHandlers() {
    this.socket.on("startGame", ({ playerType }) => {
      this.showGame();

      // Cargar el módulo apropiado del juego
      if (playerType === "bird") {
        import("../twoBirds.js")
          .then((module) => {
            module.initBirdsGame(this.socket, this.audioVolume)
              .then(controller => {
                this.gameController = controller;
              })
              .catch(console.error);
          })
          .catch(console.error);
      } else {
        import("../oneStone.js")
          .then((module) => {
            module.initStoneGame(this.socket, this.audioVolume)
              .then(controller => {
                this.gameController = controller;
              })
              .catch(console.error);
          })
          .catch(console.error);
      }
    });

    this.socket.on("playerDisconnected", (playerType) => {
      const playerTypeText = playerType === "bird" ? "pájaro" : "piedra";
      alert(`El jugador ${playerTypeText} se ha desconectado.`);
      this.showMainMenu();
    });

    this.socket.on("gameReady", (isReady) => {
      if (isReady) {
        alert("¡El juego está listo! Ambos jugadores conectados.");
      }
    });

    this.socket.on("roomError", (error) => {
      alert(error);
    });

    this.socket.on("roomCreated", (roomName) => {
      this.socket.emit("joinRoom", {
        roomName,
        playerType: this.selectedPlayerType,
      });
    });

    this.socket.on("roomJoined", ({ roomName, playerType, isComplete }) => {
      this.showGame();      // Cargar el módulo apropiado del juego
      if (playerType === "bird") {
        import("../twoBirds.js")
          .then((module) => {
            module.initBirdsGame(this.socket, this.audioVolume)
              .then(controller => {
                this.gameController = controller;
              })
              .catch(console.error);
          })
          .catch(console.error);
      } else {
        import("../oneStone.js")
          .then((module) => {
            module.initStoneGame(this.socket, this.audioVolume)
              .then(controller => {
                this.gameController = controller;
              })
              .catch(console.error);
          })
          .catch(console.error);
      }
    });
  }
  /**
   * @method init
   * @description Inicializa la interfaz de usuario
   */
  init() {
    this.showMainMenu();
    this.setupSocketHandlers();

    // Añadir evento de redimensionamiento de ventana para el canvas
    window.addEventListener("resize", () => {
      const resizeEvent = new CustomEvent("game-resize");
      window.dispatchEvent(resizeEvent);
    });
  }
}

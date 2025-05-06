// UI Controller manages the UI state and component creation
import {
  List,
  ArrowBack,
  Modal,
  Settings,
  AudioSettingContent,
  ToggleFullScreen,
} from "./components/index.js";

export class UIController {
  constructor(socket) {
    this.menuContainer = document.getElementById("menu");
    this.gameContainer = document.getElementById("game-container");
    this.socket = socket;
    this.selectedPlayerType = null;

    // Create container for UI controls during gameplay
    this.gameUIContainer = document.createElement("div");
    this.gameUIContainer.className = "game-ui-container";
    document.body.appendChild(this.gameUIContainer);
  }

  // Show main menu with options
  showMainMenu() {
    // Clear menu content first
    this.menuContainer.innerHTML = "";
    this.menuContainer.classList.remove("hidden");
    this.gameContainer.classList.add("hidden");

    // Add title
    const title = document.createElement("h1");
    title.textContent = "Kill Two Birds with One Stone";
    this.menuContainer.appendChild(title);

    // Create menu options
    const menuOptions = {
      "Un jugador": () => this.startSinglePlayerGame(),
      "Unirse a una sala": () => this.showJoinRoomMenu(),
      "Crear una sala": () => this.showCreateRoomMenu(),
      Ajustes: () => this.showSettings(),
    };

    // Create and append list component
    const menuList = new List(menuOptions);
    this.menuContainer.appendChild(menuList.render());

    // Add fullscreen toggle
    const fullscreenToggle = new ToggleFullScreen();
    this.menuContainer.appendChild(fullscreenToggle.render());
  }

  // Handle single player game start
  async startSinglePlayerGame() {
    this.showGame();
    try {
      const module = await import("../singlePlayer.js");
      await module.initSinglePlayerMode();
    } catch (error) {
      console.error("Error loading single player game:", error);
    }
  }

  // Show join room menu
  showJoinRoomMenu() {
    // Clear menu content
    this.menuContainer.innerHTML = "";

    // Add title
    const title = document.createElement("h2");
    title.textContent = "Unirse a una sala";
    this.menuContainer.appendChild(title);

    // Add back button
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.menuContainer.appendChild(backButton.render());

    // Create role selection
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

  // Load available rooms from server
  loadRooms() {
    // Clear previous room list
    const existingRoomList = document.getElementById("room-list");
    if (existingRoomList) {
      existingRoomList.remove();
    }

    // Create room list container
    const roomListContainer = document.createElement("div");
    roomListContainer.id = "room-list";
    roomListContainer.className = "room-list";
    this.menuContainer.appendChild(roomListContainer);

    // Request rooms from server
    this.socket.emit("getRooms");

    // Update room list when server responds
    this.socket.on("roomList", (rooms) => {
      this.updateRoomList(rooms);
    });
  }

  // Update the room list with data from server
  updateRoomList(rooms) {
    const roomListContainer = document.getElementById("room-list");
    if (!roomListContainer) return;

    // Clear previous content
    roomListContainer.innerHTML = "";

    if (rooms.length === 0) {
      const noRooms = document.createElement("p");
      noRooms.textContent = "No hay salas disponibles";
      roomListContainer.appendChild(noRooms);
      return;
    }

    // Create room items
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
      }

      // Create room item
      const roomItem = document.createElement("div");
      roomItem.className = "room-item";

      // Room name and status
      const roomName = document.createElement("span");
      roomName.textContent = `${room.name} ${statusText}`;
      roomItem.appendChild(roomName);

      // Join button
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

  // Show create room menu
  showCreateRoomMenu() {
    // Clear menu content
    this.menuContainer.innerHTML = "";

    // Add title
    const title = document.createElement("h2");
    title.textContent = "Crear una sala";
    this.menuContainer.appendChild(title);

    // Add back button
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.menuContainer.appendChild(backButton.render());

    // Create room form
    const createRoomForm = document.createElement("div");
    createRoomForm.className = "create-room-form";

    // Room name input
    const roomNameInput = document.createElement("input");
    roomNameInput.type = "text";
    roomNameInput.id = "room-name";
    roomNameInput.placeholder = "Nombre de la sala";
    createRoomForm.appendChild(roomNameInput);

    // Role selection title
    const roleTitle = document.createElement("h3");
    roleTitle.textContent = "Selecciona tu rol:";
    createRoomForm.appendChild(roleTitle);

    // Role selection buttons
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
    createRoomForm.appendChild(roleButtons);

    // Create button
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

  // Show settings menu
  showSettings(inModal = false) {
    // Create settings container
    const settingsContainer = document.createElement("div");
    settingsContainer.className = "settings-container";

    // Add title
    const title = document.createElement("h2");
    title.textContent = "Ajustes";
    settingsContainer.appendChild(title);

    // If not in modal, add back button
    if (!inModal) {
      const backButton = new ArrowBack(() => this.showMainMenu());
      settingsContainer.appendChild(backButton.render());
    }

    // Add audio settings
    const audioSettings = new AudioSettingContent((value) => {
      // Placeholder for audio settings functionality
      console.log("Audio level set to:", value);
    });
    settingsContainer.appendChild(audioSettings.render());

    if (inModal) {
      return settingsContainer;
    } else {
      // Clear menu content and add settings
      this.menuContainer.innerHTML = "";
      this.menuContainer.appendChild(settingsContainer);
    }
  }

  // Show game and hide menu
  showGame() {
    this.menuContainer.innerHTML = ""; // Clear menu content
    this.menuContainer.classList.add("hidden");
    this.gameContainer.classList.remove("hidden");

    // Add settings button to game UI
    const settingsButton = new Settings(() => this.showGameMenu());
    this.gameUIContainer.innerHTML = ""; // Clear previous UI
    this.gameUIContainer.appendChild(settingsButton.render());

    // Add fullscreen toggle to game UI
    const fullscreenToggle = new ToggleFullScreen();
    this.gameUIContainer.appendChild(fullscreenToggle.render());

    // Resize canvas for the game
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }

  // Show in-game menu
  showGameMenu() {
    // Create modal with game menu options
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
        this.showMainMenu();
      },
    };

    // Create list component for the modal
    const menuList = new List(menuOptions);
    const modal = new Modal(menuList.render(), "game-modal");
    document.body.appendChild(modal.render());
  }

  // Setup socket event handlers
  setupSocketHandlers() {
    this.socket.on("startGame", ({ playerType }) => {
      this.showGame();

      // Load the appropriate game module
      if (playerType === "bird") {
        import("../twoBirds.js")
          .then((module) => {
            module.initBirdsGame(this.socket).catch(console.error);
          })
          .catch(console.error);
      } else {
        import("../oneStone.js")
          .then((module) => {
            module.initStoneGame(this.socket).catch(console.error);
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
      this.showGame();

      // Load the appropriate game module
      if (playerType === "bird") {
        import("../twoBirds.js")
          .then((module) => {
            module.initBirdsGame(this.socket).catch(console.error);
          })
          .catch(console.error);
      } else {
        import("../oneStone.js")
          .then((module) => {
            module.initStoneGame(this.socket).catch(console.error);
          })
          .catch(console.error);
      }
    });
  }

  // Initialize the UI
  init() {
    this.showMainMenu();
    this.setupSocketHandlers();

    // Add window resize event for canvas
    //! Parece Duplicado con main.js
    window.addEventListener("resize", () => {
      const resizeEvent = new CustomEvent("game-resize");
      window.dispatchEvent(resizeEvent);
    });
  }
}

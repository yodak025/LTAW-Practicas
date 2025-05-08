// UI Controller manages the server interface
import { List } from '../public/game/ui/components/List.js';
import { ArrowBack } from '../public/game/ui/components/ArrowBack.js';
import { ToggleFullScreen } from '../public/game/ui/components/ToggleFullScreen.js';

// Getting Electron API through preload
const { ipcRenderer } = window.require('electron');

export class UIController {
  constructor() {
    this.serverContainer = document.getElementById("server-container");
    this.serverUI = document.getElementById("server-ui");
    
    // Store references to any client windows
    this.clientWindows = [];
    
    // Store system information
    this.systemInfo = null;
  }

  // Show main menu with options
  showMainMenu() {
    // Clear content first
    this.serverUI.innerHTML = "";

    // Add title
    const title = document.createElement("h1");
    title.textContent = "Kill Two Birds with One Stone - Server";
    title.classList.add("server-title");
    this.serverUI.appendChild(title);

    // Create menu options
    const menuOptions = {
      "Iniciar Cliente Local": () => this.launchLocalClient(),
      "Crear Nueva Sala": () => this.showCreateRoomInterface(),
      "Seleccionar Red": () => this.showNetworkSelection(),
      "Modificar Constantes": () => this.showConstants(),
      "Información": () => this.showInfo(),
      "Salir": () => this.quitApplication()
    };

    // Create and append list component
    const menuList = new List(menuOptions, "server-menu");
    this.serverUI.appendChild(menuList.render());
    
    // Add fullscreen toggle
    const fullscreenToggle = new ToggleFullScreen();
    this.serverUI.appendChild(fullscreenToggle.render());
    
    // Add server status indicator
    this.addServerStatus();
  }
  
  // Add server status indicator
  addServerStatus() {
    const statusContainer = document.createElement("div");
    statusContainer.className = "server-status-container";
    
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Estado del servidor: ";
    statusContainer.appendChild(statusLabel);
    
    const statusValue = document.createElement("span");
    statusValue.className = "server-status-value active";
    statusValue.textContent = "Activo";
    statusContainer.appendChild(statusValue);
    
    const statusPort = document.createElement("div");
    statusPort.className = "server-port";
    statusPort.textContent = "Puerto: 9000";
    statusContainer.appendChild(statusPort);
    
    this.serverUI.appendChild(statusContainer);
  }

  // Launch a local client window
  launchLocalClient() {
    ipcRenderer.send('launch-client');
  }

  // Show interface for creating a new room (placeholder)
  showCreateRoomInterface() {
    console.log("Crear Nueva Sala - Funcionalidad no implementada aún");
    // Placeholder - will be implemented later
  }

  // Show network selection interface (placeholder)
  showNetworkSelection() {
    console.log("Seleccionar Red - Funcionalidad no implementada aún");
    // Placeholder - will be implemented later
  }

  // Show game constants management interface (placeholder)
  showConstants() {
    console.log("Modificar Constantes - Funcionalidad no implementada aún");
    // Placeholder - will be implemented later
  }

  // Show information about the server
  showInfo() {
    // Clear content first
    this.serverUI.innerHTML = "";
    
    // Add title
    const title = document.createElement("h1");
    title.textContent = "Información del Servidor";
    title.classList.add("server-title");
    this.serverUI.appendChild(title);
    
    // Add back button using ArrowBack component
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.serverUI.appendChild(backButton.render());
    
    // Create info container
    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";
    
    // Add loading indicator
    const loading = document.createElement("div");
    loading.className = "loading";
    loading.textContent = "Cargando información del sistema...";
    infoContainer.appendChild(loading);
    
    this.serverUI.appendChild(infoContainer);
    
    // Request system info from main process
    ipcRenderer.send('get-system-info');
  }
  
  // Display system information
  displaySystemInfo(info) {
    const infoContainer = document.querySelector(".info-container");
    if (!infoContainer) return;
    
    // Clear loading indicator
    infoContainer.innerHTML = "";
    
    // Create sections for different types of info
    this.addInfoSection(infoContainer, "Versiones", {
      "Electron": info.electron,
      "Chrome": info.chrome,
      "Node.js": info.node,
      "V8": info.v8
    });
    
    this.addInfoSection(infoContainer, "Aplicación", {
      "Nombre": info.app.name,
      "Versión": info.app.version,
      "Autor": info.app.author
    });
    
    this.addInfoSection(infoContainer, "Sistema", {
      "Plataforma": this.formatPlatformName(info.platform),
      "Arquitectura": info.arch,
      "Sistema Operativo": `${info.osName} ${info.osVersion}`,
      "Modelo CPU": info.cpuModel,
      "Núcleos CPU": info.cpuCores,
      "Memoria Total": info.totalMemory,
      "Memoria Disponible": info.freeMemory
    });
    
    // Add dependencies section
    const depSection = document.createElement("div");
    depSection.className = "info-section";
    
    const depTitle = document.createElement("h2");
    depTitle.textContent = "Dependencias";
    depSection.appendChild(depTitle);
    
    const depItems = document.createElement("div");
    depItems.className = "dep-items";
    
    // Add each dependency as a separate item
    for (const [dep, version] of Object.entries(info.dependencies)) {
      const depItem = document.createElement("div");
      depItem.className = "dep-item";
      depItem.innerHTML = `<span class="dep-name">${dep}</span>: <span class="dep-version">${version}</span>`;
      depItems.appendChild(depItem);
    }
    
    depSection.appendChild(depItems);
    infoContainer.appendChild(depSection);
  }
  
  // Add a section of information with key-value pairs
  addInfoSection(container, title, data) {
    const section = document.createElement("div");
    section.className = "info-section";
    
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);
    
    const table = document.createElement("table");
    table.className = "info-table";
    
    // Add each data item as a table row
    for (const [key, value] of Object.entries(data)) {
      const row = document.createElement("tr");
      
      const keyCell = document.createElement("td");
      keyCell.className = "info-key";
      keyCell.textContent = key;
      row.appendChild(keyCell);
      
      const valueCell = document.createElement("td");
      valueCell.className = "info-value";
      valueCell.textContent = value;
      row.appendChild(valueCell);
      
      table.appendChild(row);
    }
    
    section.appendChild(table);
    container.appendChild(section);
  }
  
  // Format platform name to be more readable
  formatPlatformName(platform) {
    const platforms = {
      'win32': 'Windows',
      'darwin': 'macOS',
      'linux': 'Linux',
      'freebsd': 'FreeBSD',
      'openbsd': 'OpenBSD',
      'sunos': 'SunOS'
    };
    
    return platforms[platform] || platform;
  }

  // Quit the application, closing all windows
  quitApplication() {
    ipcRenderer.send('quit-app');
  }

  // Initialize the UI
  init() {
    this.showMainMenu();
    
    // Setup IPC event listeners for communication with main process
    this.setupIPCListeners();
  }
  
  // Setup IPC event listeners
  setupIPCListeners() {
    // Example: Listening for client window creation confirmation
    ipcRenderer.on('client-launched', (event, clientId) => {
      console.log(`Cliente iniciado con ID: ${clientId}`);
      this.clientWindows.push(clientId);
    });
    
    // Listen for system info response
    ipcRenderer.on('system-info', (event, info) => {
      console.log('Información del sistema recibida:', info);
      this.systemInfo = info;
      this.displaySystemInfo(info);
    });
  }
}
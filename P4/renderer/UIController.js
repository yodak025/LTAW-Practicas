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
    
    // Store current constants
    this.gameConstants = null;
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

  // Show constants modification interface
  showConstants() {
    // Clear content first
    this.serverUI.innerHTML = "";
    
    // Add title
    const title = document.createElement("h1");
    title.textContent = "Modificar Constantes";
    title.classList.add("server-title");
    this.serverUI.appendChild(title);
    
    // Add back button using ArrowBack component
    const backButton = new ArrowBack(() => this.showMainMenu());
    this.serverUI.appendChild(backButton.render());
    
    // Create constants container
    const constantsContainer = document.createElement("div");
    constantsContainer.className = "constants-container";
    
    // Add loading indicator
    const loading = document.createElement("div");
    loading.className = "loading";
    loading.textContent = "Cargando constantes del juego...";
    constantsContainer.appendChild(loading);
    
    this.serverUI.appendChild(constantsContainer);
    
    // Request constants from main process
    ipcRenderer.send('get-game-constants');
  }
  
  // Display constants for editing
  displayConstants(constants) {
    const constantsContainer = document.querySelector(".constants-container");
    if (!constantsContainer) return;
    
    // Store the constants
    this.gameConstants = constants;
    
    // Clear loading indicator
    constantsContainer.innerHTML = "";
    
    // Create the search bar
    const searchDiv = document.createElement("div");
    searchDiv.className = "constants-search";
    
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar constantes...";
    searchInput.className = "constants-search-input";
    searchInput.addEventListener("input", (e) => this.filterConstants(e.target.value));
    
    searchDiv.appendChild(searchInput);
    constantsContainer.appendChild(searchDiv);
    
    // Create tabbed interface
    const tabContainer = document.createElement("div");
    tabContainer.className = "constants-tabs";
    
    // Get all top-level categories
    const categoryTabs = {};
    for (const key in constants) {
      categoryTabs[key] = () => this.showConstantCategory(key);
    }
    
    const tabsList = new List(categoryTabs, "constants-tabs-list");
    tabContainer.appendChild(tabsList.render());
    constantsContainer.appendChild(tabContainer);
    
    // Create container for constants sections
    const sectionsContainer = document.createElement("div");
    sectionsContainer.className = "constants-sections";
    constantsContainer.appendChild(sectionsContainer);
    
    // Show first category by default
    const firstCategory = Object.keys(constants)[0];
    this.showConstantCategory(firstCategory);
    
    // Add save button
    const saveButtonContainer = document.createElement("div");
    saveButtonContainer.className = "save-constants-container";
    
    const saveButton = document.createElement("button");
    saveButton.textContent = "Guardar cambios";
    saveButton.className = "save-constants-button";
    saveButton.addEventListener("click", () => this.saveConstants());
    
    saveButtonContainer.appendChild(saveButton);
    constantsContainer.appendChild(saveButtonContainer);
  }
  
  // Filter constants based on search term
  filterConstants(searchTerm) {
    const sectionsContainer = document.querySelector(".constants-sections");
    if (!sectionsContainer || !this.gameConstants) return;
    
    // Clear current sections
    sectionsContainer.innerHTML = "";
    
    if (!searchTerm.trim()) {
      // If search term is empty, show the currently selected category
      const activeCategoryTab = document.querySelector(".constants-tabs-list .list-item.active");
      if (activeCategoryTab) {
        this.showConstantCategory(activeCategoryTab.textContent);
      } else {
        this.showConstantCategory(Object.keys(this.gameConstants)[0]);
      }
      return;
    }
    
    // Create a flat structure of all constants with their paths for searching
    const flatConstants = this.flattenConstants(this.gameConstants);
    
    // Filter constants based on search term
    const searchResults = {};
    for (const path in flatConstants) {
      if (path.toLowerCase().includes(searchTerm.toLowerCase())) {
        // Add this constant to search results
        const value = flatConstants[path];
        const pathParts = path.split('.');
        const lastKey = pathParts.pop();
        const parentPath = pathParts.join('.');
        
        if (!searchResults[parentPath]) {
          searchResults[parentPath] = {};
        }
        
        searchResults[parentPath][lastKey] = value;
      }
    }
    
    // Display search results
    if (Object.keys(searchResults).length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No se encontraron constantes que coincidan con: " + searchTerm;
      sectionsContainer.appendChild(noResults);
    } else {
      // Display each result category
      for (const categoryPath in searchResults) {
        const category = searchResults[categoryPath];
        
        const categoryContainer = document.createElement("div");
        categoryContainer.className = "constants-category search-result";
        
        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = categoryPath || "Constantes principales";
        categoryContainer.appendChild(categoryTitle);
        
        // Create form for category constants
        const categoryForm = document.createElement("form");
        categoryForm.className = "constants-form";
        
        // Add each constant in this category
        for (const key in category) {
          this.createConstantField(categoryForm, key, category[key], `${categoryPath ? categoryPath + '.' : ''}${key}`);
        }
        
        categoryContainer.appendChild(categoryForm);
        sectionsContainer.appendChild(categoryContainer);
      }
    }
    
    // Mark this as a search view
    sectionsContainer.dataset.viewType = "search";
    
    // Remove active state from category tabs
    const tabs = document.querySelectorAll(".constants-tabs-list .list-item");
    tabs.forEach(tab => tab.classList.remove("active"));
  }
  
  // Flatten nested constants object into dot-notation paths
  flattenConstants(obj, prefix = '') {
    let result = {};
    
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const flattened = this.flattenConstants(value, newKey);
        result = { ...result, ...flattened };
      } else {
        result[newKey] = value;
      }
    }
    
    return result;
  }

  // Show a specific category of constants
  showConstantCategory(category) {
    const sectionsContainer = document.querySelector(".constants-sections");
    if (!sectionsContainer || !this.gameConstants) return;
    
    // Clear current sections
    sectionsContainer.innerHTML = "";
    
    // Mark this as a category view
    sectionsContainer.dataset.viewType = "category";
    
    // Update active tab
    const tabs = document.querySelectorAll(".constants-tabs-list .list-item");
    tabs.forEach(tab => {
      if (tab.textContent === category) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
    
    // Get the selected category
    const categoryData = this.gameConstants[category];
    
    if (!categoryData) return;
    
    // Process this category
    this.processConstantCategory(sectionsContainer, category, categoryData);
  }
  
  // Process a category of constants
  processConstantCategory(container, categoryName, categoryData) {
    const categoryContainer = document.createElement("div");
    categoryContainer.className = "constants-category";
    
    const categoryTitle = document.createElement("h3");
    categoryTitle.textContent = categoryName;
    categoryContainer.appendChild(categoryTitle);
    
    if (typeof categoryData === 'object' && !Array.isArray(categoryData)) {
      // Category contains sub-categories
      for (const subKey in categoryData) {
        const subData = categoryData[subKey];
        
        if (typeof subData === 'object' && !Array.isArray(subData)) {
          // Create subcategory
          const subContainer = document.createElement("div");
          subContainer.className = "constants-subcategory";
          
          const subTitle = document.createElement("h4");
          subTitle.textContent = subKey;
          subContainer.appendChild(subTitle);
          
          // Create form for subcategory constants
          const subForm = document.createElement("form");
          subForm.className = "constants-form";
          
          // Handle nested objects recursively
          if (Object.keys(subData).some(key => typeof subData[key] === 'object' && !Array.isArray(subData[key]))) {
            for (const nestedKey in subData) {
              const nestedData = subData[nestedKey];
              
              if (typeof nestedData === 'object' && !Array.isArray(nestedData)) {
                const nestedGroupDiv = document.createElement("div");
                nestedGroupDiv.className = "constants-nested-group";
                
                const nestedGroupTitle = document.createElement("h5");
                nestedGroupTitle.textContent = nestedKey;
                nestedGroupDiv.appendChild(nestedGroupTitle);
                
                for (const finalKey in nestedData) {
                  this.createConstantField(nestedGroupDiv, finalKey, nestedData[finalKey], `${categoryName}.${subKey}.${nestedKey}.${finalKey}`);
                }
                
                subForm.appendChild(nestedGroupDiv);
              } else {
                // Simple key-value pair
                this.createConstantField(subForm, nestedKey, nestedData, `${categoryName}.${subKey}.${nestedKey}`);
              }
            }
          } else {
            // Add each constant in this subcategory
            for (const key in subData) {
              this.createConstantField(subForm, key, subData[key], `${categoryName}.${subKey}.${key}`);
            }
          }
          
          subContainer.appendChild(subForm);
          categoryContainer.appendChild(subContainer);
        } else {
          // Simple key-value pair
          const subForm = document.createElement("form");
          subForm.className = "constants-form";
          this.createConstantField(subForm, subKey, subData, `${categoryName}.${subKey}`);
          categoryContainer.appendChild(subForm);
        }
      }
    } else {
      // Category is a simple constant
      const categoryForm = document.createElement("form");
      categoryForm.className = "constants-form";
      this.createConstantField(categoryForm, categoryName, categoryData, categoryName);
      categoryContainer.appendChild(categoryForm);
    }
    
    container.appendChild(categoryContainer);
  }
  
  // Create an input field for a constant
  createConstantField(container, key, value, path) {
    const fieldContainer = document.createElement("div");
    fieldContainer.className = "constant-field";
    
    const label = document.createElement("label");
    label.textContent = key;
    label.title = path; // Show full path on hover
    
    const input = document.createElement("input");
    
    // Set attributes based on value type
    if (typeof value === "boolean") {
      input.type = "checkbox";
      input.checked = value;
    } else if (typeof value === "number") {
      input.type = "number";
      input.value = value;
      input.step = value % 1 === 0 ? "1" : "0.1"; // Integer or decimal step
    } else if (typeof value === "string") {
      input.type = "text";
      input.value = value;
    } else if (Array.isArray(value)) {
      // For arrays, create a textarea with JSON representation
      const textarea = document.createElement("textarea");
      textarea.value = JSON.stringify(value);
      textarea.rows = 2;
      textarea.dataset.type = "array";
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(textarea);
      fieldContainer.dataset.path = path;
      container.appendChild(fieldContainer);
      return; // Exit early as we've already added everything needed
    } else {
      // Object or other complex type, show as read-only
      input.type = "text";
      input.value = JSON.stringify(value);
      input.readOnly = true;
      fieldContainer.classList.add("complex-type");
    }
    
    // Store the path to this constant
    input.dataset.path = path;
    
    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    container.appendChild(fieldContainer);
  }
  
  // Save modified constants
  saveConstants() {
    // Collect all modified values
    const modifiedConstants = {};
    
    // Process all input fields
    const inputs = document.querySelectorAll('.constant-field input, .constant-field textarea');
    inputs.forEach(input => {
      if (input.readOnly) return; // Skip read-only fields
      
      const path = input.dataset.path;
      if (!path) return;
      
      let value;
      if (input.type === "checkbox") {
        value = input.checked;
      } else if (input.type === "number") {
        value = parseFloat(input.value);
      } else if (input.dataset.type === "array") {
        try {
          value = JSON.parse(input.value);
        } catch (e) {
          console.error(`Error parsing array value at ${path}:`, e);
          return;
        }
      } else {
        value = input.value;
        
        // Try to parse numbers or booleans from strings
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        } else if (!isNaN(value) && value.trim() !== "") {
          value = parseFloat(value);
        }
      }
      
      modifiedConstants[path] = value;
    });
    
    // Send to main process
    ipcRenderer.send('update-game-constants', modifiedConstants);
    
    // Show saving indicator
    const saveBtn = document.querySelector('.save-constants-button');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Guardando...";
    saveBtn.disabled = true;
    
    // Reset button after a delay
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 1500);
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
    
    // Listen for game constants
    ipcRenderer.on('game-constants', (event, constants) => {
      console.log('Constantes del juego recibidas');
      this.displayConstants(constants);
    });
    
    // Listen for constants update confirmation
    ipcRenderer.on('constants-updated', (event, status) => {
      // Show success message
      const saveBtn = document.querySelector('.save-constants-button');
      if (status.success) {
        saveBtn.textContent = "¡Guardado correctamente!";
        setTimeout(() => {
          saveBtn.textContent = "Guardar cambios";
          saveBtn.disabled = false;
        }, 1500);
      } else {
        saveBtn.textContent = "Error al guardar";
        saveBtn.classList.add("error");
        setTimeout(() => {
          saveBtn.textContent = "Guardar cambios";
          saveBtn.classList.remove("error");
          saveBtn.disabled = false;
        }, 1500);
      }
    });
  }
}
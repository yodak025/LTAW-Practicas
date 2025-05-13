import electron from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getGameConstants } from './constants-manager.js';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables globales
let serverWindow = null;
let clientWindows = [];
let gameConstants = {};
let onUpdateConstantsCallback = null;

/**
 * Inicializa la aplicación Electron
 * @param {Object} constants - Constantes del juego
 * @param {Function} onUpdateConstants - Callback que se ejecuta cuando se actualizan las constantes
 */
export function initElectronApp(constants, onUpdateConstants) {
  gameConstants = constants;
  onUpdateConstantsCallback = onUpdateConstants;
}

/**
 * Crea la ventana principal del servidor
 */
export function createServerWindow() {
  serverWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "Kill Two Birds with One Stone - Server",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar la interfaz del renderer
  serverWindow.loadFile(join(dirname(dirname(__filename)), "renderer", "index.html"));
  
  // Desactivar el menú
  serverWindow.setMenuBarVisibility(false);

  // Manejar cierre de la ventana
  serverWindow.on('closed', () => {
    serverWindow = null;
    // Cerrar todas las ventanas de cliente también
    clientWindows.forEach(clientWin => {
      if (!clientWin.isDestroyed()) clientWin.close();
    });
    clientWindows = [];
  });
}

/**
 * Crea una ventana de cliente para el juego
 * @returns {string} - ID único para la ventana cliente
 */
export function createClientWindow() {
  const clientWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "Kill Two Birds with One Stone - Cliente",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar la página web del juego
  clientWindow.loadURL('http://localhost:9000/');
  
  // Desactivar el menú
  clientWindow.setMenuBarVisibility(false);

  // Generar un ID único para esta ventana
  const clientId = Date.now().toString();
  
  // Manejar el cierre de la ventana cliente
  clientWindow.on('closed', () => {
    // Eliminar de la lista de clientes
    clientWindows = clientWindows.filter(win => win !== clientWindow);
  });
  
  // Añadir a la lista de ventanas de cliente
  clientWindows.push(clientWindow);
  
  // Notificar al renderer
  if (serverWindow && !serverWindow.isDestroyed()) {
    serverWindow.webContents.send('client-launched', clientId);
  }
  
  return clientId;
}

/**
 * Configura los eventos IPC para la comunicación entre procesos
 * @param {Function} getSystemInfo - Función para obtener información del sistema
 */
export function setupIPCEvents(getSystemInfo) {
  // Configurar canales IPC para comunicación con el renderer
  electron.ipcMain.on('launch-client', (event) => {
    const clientId = createClientWindow();
    event.reply('client-launched', clientId);
  });
  
  // Canal para salir de la aplicación
  electron.ipcMain.on('quit-app', () => {
    // Cerrar todas las ventanas
    clientWindows.forEach(win => {
      if (!win.isDestroyed()) win.close();
    });
    
    // Cerrar la aplicación
    electron.app.quit();
  });
  
  // Canal para enviar información del sistema
  electron.ipcMain.on('get-system-info', (event) => {
    const systemInfo = getSystemInfo();
    event.reply('system-info', systemInfo);
  });
  
  // Canal para obtener constantes del juego
  electron.ipcMain.on('get-game-constants', (event) => {
    // Obtener las constantes editables directamente desde el módulo de constantes
    const editableConstants = getGameConstants();
    event.reply('game-constants', editableConstants);
  });
  
  // Canal para actualizar constantes del juego
  electron.ipcMain.on('update-game-constants', (event, modifiedConstants) => {
    try {
      if (onUpdateConstantsCallback) {
        const result = onUpdateConstantsCallback(modifiedConstants);
        event.reply('constants-updated', result);
      } else {
        event.reply('constants-updated', { success: false, error: 'No callback for updating constants' });
      }
    } catch (error) {
      console.error('Error al actualizar constantes:', error);
      event.reply('constants-updated', { success: false, error: error.message });
    }
  });
}

/**
 * Cierra todas las ventanas de cliente
 */
export function closeAllClientWindows() {
  clientWindows.forEach(win => {
    if (!win.isDestroyed()) win.close();
  });
  clientWindows = [];
}
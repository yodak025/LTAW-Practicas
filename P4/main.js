import electron from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Importar módulos refactorizados
import { 
  initConstantsManager, 
  updateConstantsByPath, 
  saveCustomConstants, 
  getGameConstants 
} from './src/constants-manager.js';
import { initWebServer, notifyConstantsUpdated, closeServer } from './src/web-server.js';
import { 
  initElectronApp, 
  createServerWindow, 
  setupIPCEvents 
} from './src/electron-app.js';
import { getSystemInfo } from './src/utils.js';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Arrancando electron...");

// Directorio para almacenar la configuración
const configDir = join(__dirname, 'config');
if (!existsSync(configDir)) {
  mkdirSync(configDir, { recursive: true });
}

// Inicializar el gestor de constantes
const gameConstants = initConstantsManager(configDir);

// Función callback para actualizar constantes desde Electron
function handleConstantsUpdate(modifiedConstants) {
  try {
    // Actualizar constantes
    updateConstantsByPath(gameConstants, modifiedConstants);
    
    // Guardar las constantes personalizadas
    const saved = saveCustomConstants(modifiedConstants);
    
    // Notificar a todos los clientes que las constantes han cambiado
    notifyConstantsUpdated();
    
    // Devolver resultado
    return { success: saved };
  } catch (error) {
    console.error('Error al actualizar constantes:', error);
    return { success: false, error: error.message };
  }
}

// Inicializar el servidor web
const PORT = process.env.PORT || 9000;
initWebServer(PORT, gameConstants, handleConstantsUpdate);

// Inicializar la aplicación Electron
initElectronApp(gameConstants, handleConstantsUpdate);

// Eventos de la aplicación Electron
electron.app.on('ready', () => {
  console.log("Evento Ready!");
  
  // Crear la ventana principal del servidor
  createServerWindow();
  
  // Configurar eventos IPC
  setupIPCEvents(getSystemInfo);
});

// Manejo de eventos adicionales de la aplicación Electron
electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createServerWindow();
  }
});

electron.app.on('quit', () => {
  closeServer();
});




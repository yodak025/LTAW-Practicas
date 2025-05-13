import os from 'os';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recopila información del sistema
 * @returns {Object} - Información del sistema
 */
export function getSystemInfo() {
  // Leer package.json para obtener información de dependencias
  let packageInfo;
  try {
    const packageJson = readFileSync(join(dirname(__dirname), 'package.json'), 'utf8');
    packageInfo = JSON.parse(packageJson);
  } catch (error) {
    console.error('Error al leer package.json:', error);
    packageInfo = { dependencies: {}, version: 'desconocida' };
  }
  
  return {
    // Versiones de entorno
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8,
    
    // Detalles del proyecto
    app: {
      name: packageInfo.name || 'Kill Two Birds with One Stone Server',
      version: packageInfo.version || '0.1.0',
      author: packageInfo.author || 'Desconocido',
    },
    
    // Dependencias del proyecto
    dependencies: packageInfo.dependencies || {},
    
    // Información del sistema
    platform: process.platform,
    arch: process.arch,
    osName: os.type(),
    osVersion: os.release(),
    cpuModel: os.cpus()[0]?.model || 'Desconocido',
    cpuCores: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + ' GB',
    freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)) + ' GB',
    
    // Tiempo de ejecución
    uptime: Math.floor(process.uptime()) + ' segundos',
  };
}
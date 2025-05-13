import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables para almacenar las constantes
let gameConstants = {};
let customConstantsPath = '';

// Lista de constantes editables - se usará para exponer solo las propiedades que se pueden editar
const EDITABLE_CONSTANTS = [
  'ENTITY', 'GAME', 'PHYSICS', 'UI', 'AUDIO', 'NETWORK', 'MULTIPLAYER'
];

/**
 * Inicializa el gestor de constantes
 * @param {string} configPath - Ruta al directorio de configuración
 * @returns {Object} - Las constantes del juego
 */
export function initConstantsManager(configPath) {
  // Ruta del archivo de constantes modificadas
  customConstantsPath = join(configPath, 'custom-constants.json');

  // Cargar constantes originales
  try {
    const constantsFile = readFileSync(join(dirname(dirname(__filename)), 'public', 'game', 'constants.js'), 'utf8');
    // Extraer las constantes definidas en el archivo
    gameConstants = extractConstantsFromJS(constantsFile);
    console.log("Constantes originales cargadas");
  } catch (error) {
    console.error('Error al cargar constantes originales:', error);
  }

  // Cargar constantes personalizadas si existen
  let customConstants = {};
  if (existsSync(customConstantsPath)) {
    try {
      const customConstantsContent = readFileSync(customConstantsPath, 'utf8');
      customConstants = JSON.parse(customConstantsContent);
      console.log("Constantes personalizadas cargadas");
    } catch (error) {
      console.error('Error al cargar constantes personalizadas:', error);
    }
  }

  // Fusionar constantes originales con las personalizadas
  mergeConstants(gameConstants, customConstants);
  
  return gameConstants;
}

/**
 * Extrae constantes de un archivo JS
 * @param {string} content - Contenido del archivo JS
 * @returns {Object} - Objeto con las constantes extraídas
 */
function extractConstantsFromJS(content) {
  const constants = {};
  const constantsNames = [];
  const constantsValues = [];
  
  // Buscar todas las declaraciones de exportación
  // Por ejemplo: export const NORMALIZED_SPACE = { ... }
  const exportRegex = /export const (\w+) = ({[\s\S]*?});/g;
  let match;
  
  // Primer paso: recolectar todos los nombres y valores sin evaluarlos
  while ((match = exportRegex.exec(content)) !== null) {
    const constantName = match[1];
    const constantValue = match[2];
    
    constantsNames.push(constantName);
    constantsValues.push(constantValue);
  }
  
  // Segundo paso: evaluar cada constante en orden
  // Esto permitirá que las constantes posteriores referencien a las anteriores
  for (let i = 0; i < constantsNames.length; i++) {
    const constantName = constantsNames[i];
    const constantValue = constantsValues[i];
    
    try {
      // Preparar un contexto para la evaluación que incluya las constantes ya procesadas
      let evalContext = "";
      for (const name in constants) {
        evalContext += `const ${name} = ${JSON.stringify(constants[name])};\n`;
      }
      
      // Limpiar el valor de comentarios
      const cleanValue = constantValue
        .replace(/\/\/.*$/gm, '') // Eliminar comentarios de línea
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Eliminar comentarios multilínea
      
      // Construir la función de evaluación con el contexto preparado
      const evalFunction = new Function(evalContext + `return ${cleanValue}`);
      constants[constantName] = evalFunction();
      
    } catch (error) {
      console.error(`Error al parsear la constante ${constantName}:`, error);
      constants[constantName] = {}; // Valor por defecto en caso de error
    }
  }
  
  return constants;
}

/**
 * Fusiona objetos profundos
 * @param {Object} target - Objeto destino
 * @param {Object} source - Objeto fuente
 */
function mergeConstants(target, source) {
  // Recorrer cada propiedad del objeto fuente (constantes personalizadas)
  for (const key in source) {
    // Si la propiedad es un objeto y no un array, y existe en target
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      // Recursivamente fusionar los objetos
      mergeConstants(target[key], source[key]);
    } else {
      // De lo contrario, sobrescribir el valor en el objeto objetivo
      target[key] = source[key];
    }
  }
}

/**
 * Actualiza valores de constantes usando rutas con punto
 * @param {Object} constants - Constantes del juego
 * @param {Object} paths - Objeto con rutas y valores
 */
export function updateConstantsByPath(constants, paths) {
  for (const path in paths) {
    const value = paths[path];
    const parts = path.split('.');
    
    // El primer nivel suele ser el nombre de la constante exportada (ENTITY, UI, etc)
    const topLevelConstant = parts[0];
    
    // Si no existe la constante de primer nivel, saltar esta actualización
    if (!constants[topLevelConstant]) {
      console.warn(`La constante de primer nivel '${topLevelConstant}' no existe`);
      continue;
    }
    
    // Caso especial cuando solo hay una parte (constante de nivel superior)
    if (parts.length === 1) {
      constants[topLevelConstant] = value;
      continue;
    }
    
    // Navegar por el objeto hasta el penúltimo nivel
    let current = constants[topLevelConstant];
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    // Establecer el valor en el último nivel
    const lastKey = parts[parts.length - 1];
    current[lastKey] = value;
  }
}

/**
 * Guarda las constantes modificadas
 * @param {Object} constants - Constantes modificadas
 * @returns {boolean} - true si se guardó correctamente
 */
export function saveCustomConstants(constants) {
  try {
    // Convertir el objeto de modificaciones a un formato de paths
    // para mantener la consistencia con cómo se aplican las actualizaciones
    const pathsToSave = {};
    
    // Recorrer las rutas y guardar
    for (const path in constants) {
      pathsToSave[path] = constants[path];
    }
    
    // Guardar el archivo JSON
    writeFileSync(customConstantsPath, JSON.stringify(pathsToSave, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al guardar constantes personalizadas:', error);
    return false;
  }
}

/**
 * Prepara un objeto con la estructura de constantes necesaria para la interfaz de edición
 * @returns {Object} - Objeto con las constantes editables y su estructura
 */
function prepareEditableConstants() {
  const editableConstants = {};
  
  // Extraer solo las constantes editables
  EDITABLE_CONSTANTS.forEach(key => {
    if (gameConstants[key]) {
      editableConstants[key] = JSON.parse(JSON.stringify(gameConstants[key])); // Clonar para evitar problemas de referencia
    }
  });
  
  return editableConstants;
}

/**
 * Obtiene las constantes del juego
 * @returns {Object} - Las constantes del juego
 */
export function getGameConstants() {
  return prepareEditableConstants();
}
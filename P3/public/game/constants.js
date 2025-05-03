// Constantes globales para el juego

// Configuración del espacio de juego normalizado
export const NORMALIZED_SPACE = {
  WIDTH: 16, // Ancho del espacio de juego (x: 0-16)
  HEIGHT: 9, // Alto del espacio de juego (y: 0-9)
  ASPECT_RATIO: 16 / 9, // Relación de aspecto 16:9
};

// Configuración de entidades
export const ENTITY = {
  // Dimensiones por defecto para entidades (para compatibilidad con código existente)
  DEFAULT_SIZE: 0.5,
  VELOCITY_THRESHOLD: 0.5, // Velocidad mínima antes de detener el movimiento

  // Valores para pájaros
  BIRD: {
    DEFAULT_HEALTH: 1000,
    LAUNCH_SPEED_FACTOR: 10, // Factor de velocidad para el lanzamiento de pájaros
    BLUE_COLOR: "rgba(0, 0, 255, 0.3)", // Color para el colisionador del pájaro azul
    GREEN_COLOR: "rgba(0, 255, 0, 0.3)", // Color para el colisionador del pájaro verde
    SIZE: { X: 0.3, Y: 0.6 }, // Tamaño rectangular para pájaros: ancho x alto
    // Posiciones iniciales de los pájaros
    POSITIONS: {
      BLUE: { x: 6, y: 2 },
      GREEN: { x: 10, y: 2 }
    }
  },

  // Valores para roca
  STONE: {
    GRAVITY: 100, // Unidades/segundo²
    LAUNCH_SPEED_FACTOR: {
      X: 10, // Factor de velocidad para el movimiento horizontal
      Y: 10, // Factor de velocidad para el movimiento vertical
    },
    COLOR: "rgba(255, 0, 0, 0.3)", // Color para el colisionador de la roca
    RADIO: 0.4, // Radio para el colisionador circular
  },

  // Valores para berry
  BERRY: {
    DEFAULT_HEALTH: 1, // Se rompe fácilmente
    COLOR: "rgba(220, 20, 60, 0.8)", // Color rojo frambuesa para visualización en modo debug
    RADIO: 0.2, // Radio para el colisionador circular (más pequeño que la roca)
    GENERATION: {
      MAX_TOTAL: 4, // Máximo total de berries en el juego
      MAX_PER_TREE: 3, // Máximo de berries por árbol
      MIN_SPAWN_TIME: 1, // Tiempo mínimo para la aparición (segundos)
      MAX_SPAWN_TIME: 3, // Tiempo máximo para la aparición (segundos)
      SPAWN_RADIUS_FACTOR: 0.7, // Radio de la región circular (70% del ancho del árbol)
    }
  },

  // Valores para poop
  POOP: {
    DEFAULT_HEALTH: 10, // Resistencia del poop
    COLOR: "rgba(139, 69, 19, 0.6)", // Color marrón para el colisionador
    RADIO: 0.15, // Radio para el colisionador circular (más pequeño que las berries)
    GRAVITY: 150, // Gravedad específica para el poop (unidades/segundo²)
    SIZE: { X: 0.25, Y: 0.25 }, // Tamaño para el poop
  },

  // Valores para árboles (elementos decorativos)
  TREES: {
    SIZE: { width: 2.5, height: 4.0 }, // Tamaño común para ambos árboles
    LEFT: { x: 0.3, y: NORMALIZED_SPACE.HEIGHT - 5.07 }, // Posición del árbol izquierdo
    RIGHT: { x: NORMALIZED_SPACE.WIDTH - 3, y: NORMALIZED_SPACE.HEIGHT - 5.07 }, // Posición del árbol derecho
    SCALE: { x: 1.0, y: 1.0 }, // Escala visual para los árboles
  },

  // Propiedades físicas
  PHYSICS: {
    FRICTION: 0.5,
    GRAVITY: 980, // Gravedad base en unidades/segundo²
    BOUNCE_FACTOR: - 0.2, // Factor de rebote al colisionar
    DAMAGE_MULTIPLIER: 1, // Multiplicador de daño basado en velocidad de impacto
  },
};

// Configuración de animación
export const ANIMATION = {
  SPRITE_FRAME_SPEED: 5, // Frames entre cambios de sprite
  MAX_DELTA_TIME: 1 / 30, // Cap de delta time a 30 FPS
};

// Configuración de UI
export const UI = {
  DRAWING_PAD: {
    STROKE_STYLE: "white",
    LINE_WIDTH: 2,
    BACKGROUND_COLOR: "rgba(0, 0, 0, 0.3)",
    SIZE_FACTOR: 0.5, // Multiplicador para el tamaño (innerHeight * factor)
  },

  COLLIDER_COLORS: {
    DEFAULT: "rgba(100, 100, 100, 0.3)",
    PLATFORM: "rgba(128, 128, 128, 1)",
    HEALTH_BASE_RED: 255,
    HEALTH_BASE_GREEN: 255,
    HEALTH_ALPHA: 0.3,
  },

  // Modo de depuración para mostrar colisionadores y otra información útil
  DEBUG_MODE: true,

  // Configuración visual para entidades
  VISUAL: {
    // Factores de escala para sprites respecto a sus colisionadores
    STONE_SCALE: { x: 0.9, y: 0.9 }, // Escala uniforme para la roca (es circular)
    BIRD_SCALE: { x: 2.8, y: 1.4 }, // Pájaros más anchos que altos
    BERRY_SCALE: { x: 0.7, y: 0.7 }, // Escala uniforme para las berries (son circulares)
    POOP_SCALE: { x: 0.8, y: 0.8 }, // Escala uniforme para el poop (es circular)

    // Offsets verticales para ajustar la posición visual
    BIRD_OFFSET_Y: -0.05,
  },
};

// Configuración del nivel
export const LEVEL = {
  PLATFORM: {
    WIDTH: 400,
    HEIGHT: 20,
    X_OFFSET: 200, // Desplazamiento desde el centro
  },
};

// Configuración de red
export const NETWORK = {
  POSITION_THRESHOLD: 0.01, // Umbral para detectar cambios en la posición
  STATE_UPDATE_FREQUENCY: 60, // Frecuencia de actualización de estado (veces por segundo)
  MESSAGES: {
    // Mensajes del cliente al servidor
    CLIENT: {
      UPDATE_BLUE_BIRD: "blueBirdUpdate",
      UPDATE_GREEN_BIRD: "greenBirdUpdate",
      UPDATE_STONE: "stoneUpdate",
      UPDATE_BERRY: "berryUpdate",
      UPDATE_POOP: "poopUpdate",
      REQUEST_BERRY_SPAWN: "requestBerrySpawn"
    },
    // Mensajes del servidor al cliente
    SERVER: {
      BLUE_BIRD_UPDATED: "updateBlueBird",
      GREEN_BIRD_UPDATED: "updateGreenBird",
      STONE_UPDATED: "updateStone",
      BERRY_SPAWNED: "berrySpawned",
      BERRY_UPDATED: "berryUpdated",
      POOP_UPDATED: "poopUpdated"
    }
  }
};

// Rutas de recursos
export const RESOURCES = {
  SPRITES: {
    BLUE_BIRD_PREFIX: "./assets/sprites/blue-bird/",
    GREEN_BIRD_PREFIX: "./assets/sprites/green-bird/",
    BERRY_PREFIX: "./assets/sprites/berries/",
    BLUE_BIRD_FRAMES: 6, // Número de frames de animación
    GREEN_BIRD_FRAMES: 6,
    BERRIES_COUNT: 7,
    STONE_PATH: "./assets/sprites/stone.png",
    TREE_PATH: "./assets/sprites/tree.png", // Ruta al sprite del árbol
    POOP_FALLING_PATH: "./assets/sprites/poop-falling.png", // Ruta al sprite del poop cayendo
    POOP_LANDED_PATH: "./assets/sprites/poop-landed.png", // Ruta al sprite del poop en el suelo
  },
};

// Configuración del canvas
export const CANVAS = {
  MARGIN_PERCENT: 1, // Margen desde el borde de la ventana (%)
  BACKGROUND_COLOR: "black", // Color de fondo para el área alrededor del canvas
  MIN_VISIBLE_WIDTH: 200, // Ancho mínimo recomendado para visibilidad (px)
  BOX_SHADOW: "0 0 10px rgba(0, 0, 0, 0.5)", // Sombra del contenedor del juego
};

// Configuración de elementos DOM
export const DOM = {
  POSITION: {
    CENTERED: {
      POSITION: "absolute",
      TOP: "50%",
      LEFT: "50%",
      TRANSFORM: "translate(-50%, -50%)",
    },
  },
  PLAYER_TYPES: {
    BIRD: "bird",
    STONE: "stone",
  },
  CONTROLS: {
    POOP_KEY: " ", // Tecla espacio para lanzar poop
  },
};

// Configuración de mensajes
export const MESSAGES = {
  PLAYER_DISCONNECTED: {
    BIRD: "El jugador pájaro se ha desconectado",
    STONE: "El jugador piedra se ha desconectado",
  },
  GAME_READY: "¡La partida está lista! Ambos jugadores están conectados.",
  ROOM_STATUS: {
    OCCUPIED_BIRD: "(Ocupado: Ya hay un pájaro)",
    OCCUPIED_STONE: "(Ocupado: Ya hay una piedra)",
    AVAILABLE_BIRD: "(Disponible: Falta pájaro)",
    AVAILABLE_STONE: "(Disponible: Falta piedra)",
    EMPTY: "(Vacía)",
  },
};

// Configuración de juego en red
export const MULTIPLAYER = {
  ENTITY_STATES: {
    // Propiedades a sincronizar para cada tipo de entidad
    BIRD: ["x", "y", "velocityX", "velocityY", "health", "berryCount", "isFlying"],
    STONE: ["x", "y", "velocityX", "velocityY", "isLaunched"],
    BERRY: ["x", "y", "health", "isCollected", "treePosition"],
    POOP: ["x", "y", "velocityX", "velocityY", "health", "isLanded"]
  },
  ROLES: {
    BIRD_PLAYER: "bird",
    STONE_PLAYER: "stone"
  }
};

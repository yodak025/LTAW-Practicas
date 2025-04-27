// Constantes globales para el juego

// Configuración de entidades
export const ENTITY = {
    // Dimensiones por defecto para entidades
    DEFAULT_SIZE: 0.75,
    
    // Valores para pájaros
    BIRD: {
        DEFAULT_HEALTH: 100,
        VELOCITY_THRESHOLD: 0.01, // Velocidad mínima antes de detener el movimiento
    },
    
    // Valores para roca
    ROCK: {
        GRAVITY: 300, // Unidades/segundo²
    },
    
    // Propiedades físicas
    PHYSICS: {
        FRICTION: 0.5,
        GRAVITY: 980, // Gravedad base en unidades/segundo²
        BOUNCE_FACTOR: -0.5, // Factor de rebote al colisionar
        DAMAGE_MULTIPLIER: 1, // Multiplicador de daño basado en velocidad de impacto
    },
};

// Configuración de animación
export const ANIMATION = {
    SPRITE_FRAME_SPEED: 5, // Frames entre cambios de sprite
    MAX_DELTA_TIME: 1/30, // Cap de delta time a 30 FPS
};

// Configuración de UI
export const UI = {
    DRAWING_PAD: {
        STROKE_STYLE: 'white',
        LINE_WIDTH: 2,
        BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.3)',
        SIZE_FACTOR: 0.5, // Multiplicador para el tamaño (innerHeight * factor)
        SPEED_FACTOR: 10, // Factor de velocidad para el lanzamiento
    },
    
    COLLIDER_COLORS: {
        DEFAULT: 'rgba(100, 100, 100, 0.3)',
        PLATFORM: 'rgba(128, 128, 128, 1)',
        HEALTH_BASE_RED: 255,
        HEALTH_BASE_GREEN: 255,
        HEALTH_ALPHA: 0.3,
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
};

// Rutas de recursos
export const RESOURCES = {
    IMAGES: {
        BLUE_BIRD_PREFIX: './Images/BlueBird/',
        GREEN_BIRD_PREFIX: './Images/GreenBird/',
        BLUE_BIRD_FRAMES: 6, // Número de frames de animación
        GREEN_BIRD_FRAMES: 6,
        ROCK_PATH: './Images/TheRock.png',
    },
};

// Configuración del espacio de juego normalizado
export const NORMALIZED_SPACE = {
    WIDTH: 16,   // Ancho del espacio de juego (x: 0-16)
    HEIGHT: 9,   // Alto del espacio de juego (y: 0-9)
    ASPECT_RATIO: 16/9, // Relación de aspecto 16:9
};

// Configuración del canvas
export const CANVAS = {
    MARGIN_PERCENT: 1, // Margen desde el borde de la ventana (%)
    BACKGROUND_COLOR: 'black', // Color de fondo para el área alrededor del canvas
    MIN_VISIBLE_WIDTH: 200, // Ancho mínimo recomendado para visibilidad (px)
    BOX_SHADOW: '0 0 10px rgba(0, 0, 0, 0.5)', // Sombra del contenedor del juego
};

// Configuración de elementos DOM
export const DOM = {
    POSITION: {
        CENTERED: {
            POSITION: 'absolute',
            TOP: '50%',
            LEFT: '50%',
            TRANSFORM: 'translate(-50%, -50%)'
        }
    },
    PLAYER_TYPES: {
        BIRD: 'bird',
        STONE: 'stone'
    }
};

// Configuración de mensajes
export const MESSAGES = {
    PLAYER_DISCONNECTED: {
        BIRD: 'El jugador pájaro se ha desconectado',
        STONE: 'El jugador piedra se ha desconectado'
    },
    GAME_READY: '¡La partida está lista! Ambos jugadores están conectados.',
    ROOM_STATUS: {
        OCCUPIED_BIRD: '(Ocupado: Ya hay un pájaro)',
        OCCUPIED_STONE: '(Ocupado: Ya hay una piedra)',
        AVAILABLE_BIRD: '(Disponible: Falta pájaro)',
        AVAILABLE_STONE: '(Disponible: Falta piedra)',
        EMPTY: '(Vacía)'
    }
};
---
layout: ../../layouts/WikiLayout.astro
title: "Practica 3 - Documentación Técnica"
---

# Práctica 3: Documentación Técnica
## Script de Desarrollo
    npm run dev
Se ejecuta utilizando la dependencia `nodemon`. Es extremadamente útil, actualiza en tiempo real los cambios en el servidor. 

## Estructura e implementación. 

### Sobre el juego
#### Motor
Se ha implementado un sistema de entidades basado en componentes. Básicamente, una entidad es un objeto standard que se caracteriza mediante la adicción de componentes en su estado. En el juego se utilizan las siguientes componentes:
- *ColliderComponent*: Otorga a una entidad la capacidad de detectar colisiones con otras entidades mediante un sistema de bounding boxes redondas o cuadradas
- *DamageableComponent*: Otorga a una entidad la propiedad salud, y la habilita para poder recibir daño.
- *PhysicsComponent*: Otorga a una entidad la capacidad de verse afectada por la fuerza de la gravedad.
- *BerryCollectableComponent*: Maneja funcionalidades específicas de las entidades tipo Berry.
- *PoopComponent*: Maneja funcionalidades específicas de las entidades tipo Poop.

También se ha implementado un sistema de dibujado de entidades basado en clases contenedoras que guardan una referencia a la entidad que dibujan en su estado.

#### Red
Las funciones de red del juego están implementadas principalmente con *websockets*. Se utiliza el sistema de `rooms` de `socket.io`.

#### Inputs 
Los controles del juego varían según el rol del jugador y el dispositivo. En el caso de la piedra, se hace uso de un drawing pad, un canvas sobre el cual se dibuja una línea recta arrastrando el cursor o el dedo en el caso de dispositivos móviles. Esta línea determina la trayectoria que tomará la piedra en la siguiente iteración del loop. En el caso de los pájaros, serán controlados los dos en simultaneo. En el caso de PCs, los controles serán manejados con las teclas awsd para el Blue Bird y las arrowKeys para el Green Bird. Para activar la función Poop, se utiliza la tecla espacio. En el caso de dispositivos móviles, se utilizarán dos drawing pads y el clic en la pantalla.  

#### Constantes
Las constantes han sido abstraídas en un archivo propio para poder personalizar el juego de forma más cómoda. Para el desarrollo, se han implementado funcionalidades especiales como colliders visibles. Se pueden activar desde la constante DEBUG.

### Interfaz
Se ha implementado un sistema de interfaces dinámico. Se busca crear una SPA con Vanilla JavaScript. Para esto, se emula el sistema de componentes de frameworks como React.js . Se tienen los siguientes componentes:
- **ArrowBack**: Botón con forma de flecha. Recibe un callback y lo ejecuta al recibir la acción clic.
- **List**: Lista de Botones. Recibe un objeto donde las claves son el texto del elemento de la lista y el valor es el callback que será ejecutado al recibir el clic
- **Modal**: Ventana flotante que puede contener otros componentes. Incluye una capa de oscurecimiento y permite mostrar información o controles sobre el juego actual.
- **Settings**: Componente para acceder a ajustes del juego. Muestra un icono que al pulsarlo despliega un modal con las opciones disponibles.
- **AudioSettingContent**: Controles específicos para ajustar volumen y silenciar/activar el audio del juego.
- **ToggleFullScreen**: Botón que permite alternar entre modo pantalla completa y normal.

Estos componentes son manejados mediante una clase cuyos métodos modifican el contenido dentro del bloque menu en el html. Estos métodos son a la vez usados dentro de los callbacks de los otros métodos, de forma que se consigue el efecto de navegación dentro de la SPA.


## Información Relevante
### ¿Que es una SPA?
Single Page Application, son aplicaciones web que funcionan enteramente con un solo HTML que es modificado durante la ejecución mediante código JavaScript.

  



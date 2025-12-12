---
layout: ../../layouts/WikiLayout.astro
title: "Practica 1 - Documentación Técnica"
---

# Documentación Técnica
## Objetivos
La [práctica 1](/wiki/Practica-1--Diseño-y-servido-estático) tiene por objetivo generar un backend que sirva un frontend estático. Supone un primer esqueleto para la realización del proyecto [AI-Scribe](/wiki/AI-Scribe)

## Estructura e Implementación 
El proyecto presenta la siguiente estructura:

    P1/
    ├── README.md
    ├── tienda.js
    ├── frontend/
    │   ├── .gitignore
    │   ├── error-404.html
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── product.html
    │   ├── vite.config.js
    │   ├── dist/
    │   ├── public/
    │   │   ├── BigShoulders.ttf
    │   │   ├── document-icon.xml
    │   │   ├── FrontIcon.svg
    │   │   └── SVG_Sources.xml
    │   └── src/
    │       ├── App.css
    │       ├── App.jsx
    │       ├── main.jsx
    │       ├── assets/
    │       ├── components/
    │       │   ├── FrontImg.jsx
    │       │   ├── Category/
    │       │   ├── Layout/
    │       │   ├── Nav/
    │       │   └── Product/
    │       └── pages/
    │           
    └── wiki/

### `tienda.js`
Consiste en un servidor estático. Utiliza la librería nativa de Node http e implementa la lógica necesaria. 

### `App.jsx` y `components/`
La página principal se define el el archivo `App.jsx`. Su funcionamiento depende de los componentes del proyecto, que definen fragmentos de la interfaz.
 
### `pages/`
React se suele utilizar para crear SPAs, pero esto violaría las especificaciones de la práctica. Por esto, es necesario crear archivos fuente para el resto de páginas que se van a servir. 

### `dist/`
Contiene los archivos finales que serán servidos para el cliente. Puede parecer complejo, pero al final este directorio contiene los assets necesarios, los archivos HTML definidos para cada página y una serie de JavaScripts que contienen todo lo necesario para que el cliente pueda ejecutar las funcionalidades de la página. Si se inspecciona su contenido, es un jeroglífico indescifrable. Esto es intencionado, pues aporta una capa extra de seguridad. El css del proyecto se mantiene idéntico, pero se compacta en archivos según el componente. 
A nivel de Backend, esto no tiene demasiadas implicaciones, ya que el contenido que se sirve es en realidad una web "normal" con JavaScript puro. 

#### ¿Y esto como se controla? 
Para ejecución no es necesario hacer nada, pues se sirven los archivos generados. No obstante, para realizar modificaciones, es necesario instalar las dependencias del frontend. 

Desde dentro del directorio que aloja el frontend(`cd P1/frontend/` en la terminal), se debe comenzar instalando las dependencias del proyecto con:
    npm install
Esto instalará las dependencias definidas dentro del package.json, como en cualquier otro proyecto npm.

Para trabajar más cómodamente, hay un script de desarrollo frontend 
    npm run dev
Este llama a vite, que se ocupa de lanzar el cliente de forma estática. Muy útil para probar cambios sin necesidad de buildear los archivos.

Para transpilar los archivos jsx a vanilla JavaScript y empaquetar la aplicación, se utiliza el script:

    npm run build
De esta forma, Vite se ocupa de generar el frontend. Para poder empaquetar nuevas páginas, se debe modificar el archivo `vite.config.js`, en la sección:

    rollupOptions: {
      input: {
        main: 'index.html',
        notFound: './error-404.html',
        product: './product.html'
      }
    }
Se debe declarar el nombre del script que contiene el punto de entrada de la página (que es el lugar donde se renderiza) como clave y la ruta relativa a dist/ como valor, en formato JSON. Así, Vite sabe qué y donde tiene que generar.


## Tecnologías Implicadas
- Servidor Web con Node.js vanilla, sin utilizar Express. 
- Frontend Web utilizando React.js para las páginas servidas de forma estática. 
- Para la transpilación y el empaquetado se ha utilizado Vite.
- Ha sido necesario utilizar npm para instalar Vite.

## Mejoras.
A continuación, se enuncian las mejoras implementadas sobre las especificaciones de la práctica.
- Exploración de la tecnología React.js para generar páginas estáticas. 
- Empaquetado de las páginas creadas con React mediante Vite para generar archivos javascript que puedan ser servidos.
- Diseño de la web mediante wireframes. Estética trabajada. Paleta de colores propia.
- Iconos e imagen principal SVG manejados de forma explícita como XML desde React. 


## Información relevante. 
### React.js para doomies
React es una biblioteca de JavaScript para construir interfaces de usuario mediante componentes reutilizables y declarativos. En el proyecto se usa JSX, una extensión que permite escribir sintaxis similar a HTML directamente en JavaScript, facilitando la definición de la estructura de los componentes.  
Además, se utilizan hooks para gestionar el estado y los efectos en componentes funcionales. Por ejemplo, con `useState` se administra el estado interno, `useEffect` se emplea para ejecutar efectos secundarios (como suscribirse a eventos o actualizar la UI tras cambios) y `useRef` para guardar referencias persistentes a elementos del DOM. 

### Vite para doomies
Vite es una herramienta moderna de construcción y servidor de desarrollo que permite iniciar y actualizar aplicaciones de forma muy rápida mediante Hot Module Replacement (HMR). En este proyecto, Vite se utiliza para compilar y agrupar los componentes de React, optimizando tanto el tiempo de arranque como el rendimiento en producción. Su configuración, basada en plugins facilita la integración de React y mejora la experiencia de desarrollo en comparación con herramientas tradicionales.

### ¿Qué es una SPA?
Single Page Application, son aplicaciones web que funcionan enteramente con un solo HTML que es modificado durante la ejecución mediante código JavaScript. 
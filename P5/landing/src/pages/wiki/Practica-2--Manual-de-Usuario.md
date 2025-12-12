---
layout: ../../layouts/WikiLayout.astro
title: "Practica 2 - Manual de Usuario"
---

# Manual de Usuario
## Descripción
[Esta práctica](/wiki/Practica-2--Diseño-y-servido-estático) busca crear un servidor que permita a los usuarios tener la experiencia completa [AI-Scribe](/wiki/AI-Scribe). Esto implica registrarse, navegar la página, generar documentos, consultar su lista de pedidos y personalizar la apariencia de su interfaz mediante distintos temas de color. 

## Puesta en Marcha
El servidor se debe lanzar desde el subdirectorio P2. Puedes acceder a este desde la terminal con:

    cd /P2 

Para que el servidor funcione, es necesario instalar algunas dependencias por lo que es necesario que tengas instalado [`npm`](https-//docs.npmjs.com/downloading-and-installing-node-js-and-npm) en tu equipo. Si quieres hacerlo como un pro, te recomiendo que consultes el método de Obijuan con `nvm` en la [wiki de LTAW](https-//github.com/myTeachingURJC/2024-2025-LTAW/wiki/L3--Practica-1_1#usando-nvm-node-version-manager). Recuerda dejarle una estrellita (y a este repositorio también, ya puestos... 🤣). Sea como sea, teniendo `npm` ejecuta el siguiente comando para instalar las dependencias 

    npm install

Para lanzar el servidor, ejecuta el script start desde la terminal:
    
    npm run start

## Como utilizar la aplicación 
La primera vez que te conectes a la web, podrás navegar por la página principal. No obstante, para poder generar los documentos, tendrás que registrarte o iniciar sesión. 
Una vez iniciada la sesión verás que en el nav aparecen algunos botones nuevos. Voy a desgranar el funcionamiento de la página por secciones
### Tarjetas de productos.
El contenido principal de la página consiste en una serie de tarjetas con documentos divididas por secciones. Mediante los botones en cada sección se puede avanzar o retroceder entre las distintas tarjetas. Al hacer clic en *Generar Documento!*, se abrirá una página con un formulario. El usuario debe rellenar el formulario y hacer clic en el botón para generar el documento. 
### Botón AI-Scribe en el Nav
Al hacer clic se despliega un dropdown que muestra dos cliqueables. Ambos te redirigen a secciones dentro de la página principal.
### Buscador
Al hacer clic, se permite escribir texto. Si el texto coincide con alguno de los documentos, se despliega un dropdown que permite al usuario acceder al mismo. 
### Botón Carrito.
Al hacer clic en este botón, se despliega un dropdown con una lista. Esta lista contiene todos los documentos que se vayan a generar. Desde aquí, es posible eliminar los elementos deseados. También hay un botón para vaciar todos los elementos del carrito. Por último, hay un botón que permite acceder a la pantalla de tramitación de pedido. Tras tramitar el pedido, se permite al usuario ir a todos sus pedidos o a la página principal.
### Botón de Usuario.
Este botón despliega un dropdown con las siguientes opciones:
- **Mis Documentos**: Redirige al usuario a una página que contiene todos sus pedidos previos, ordenados por fecha de creación. Esta página permite visualizar todos los documentos generados.
- **Cambiar Tema**: Al hacer clic, cambia de forma persistente el tema para el usuario. Actualmente hay implementados los siguientes temas:
    - *Classic* (Tema por defecto).
    - *Dark* (Versión inspirada en *Classic* pero en modo oscuro).
    - *Cool Warm* 
    - *Green Goldy*
    - *Futuristic*
    - *Fruit*
- **Log Out**: Al hacer clic, se cierra la sesión del usuario.

## Más información
Este servidor genera páginas programadas usando *React* al vuelo mediante una implementación casera de *Server Side Rendering*, genera prompts para *modelos de lenguaje* y los manda encapsulados en peticiones *HTTP* a la *API* de un *LLM*. Para más información sobre el funcionamiento, consultar la [documentación técnica](/wiki/Practica-2--Documentación-Técnica).
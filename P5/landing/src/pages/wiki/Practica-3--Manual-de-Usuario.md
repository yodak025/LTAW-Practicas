---
layout: ../../layouts/WikiLayout.astro
title: "Practica 3 - Manual de Usuario"
---

# Práctica 3: Manual de Usuario

## Puesta en Marcha
El servidor se debe lanzar desde el subdirectorio P3. Puedes acceder a este desde la terminal con:

    cd /P3 

Para que el servidor funcione, es necesario instalar algunas dependencias por lo que es necesario que tengas instalado [`npm`](https-//docs.npmjs.com/downloading-and-installing-node-js-and-npm) en tu equipo. Si quieres hacerlo como un pro, te recomiendo que consultes el método de Obijuan con `nvm` en la [wiki de LTAW](https-//github.com/myTeachingURJC/2024-2025-LTAW/wiki/L3--Practica-1_1#usando-nvm-node-version-manager). Recuerda dejarle una estrellita (y a este repositorio también, ya puestos... 🤣). Sea como sea, teniendo `npm` ejecuta el siguiente comando para instalar las dependencias.  

    npm install

Para lanzar el servidor, ejecuta el script start desde la terminal:
    
    npm run start

## Más información
Esta aplicación permite partidas 1vs1 mediante conexión por websockets. Para más información consultar la [documentación técnica](/wiki/Practica-3--Documentación-Técnica).
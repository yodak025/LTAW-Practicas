---
layout: ../../layouts/WikiLayout.astro
title: "AI Scribe"
---

# AI-Scribe
## ¿Qué es AI-Scribe?
Se trata de una tienda online que genera documentos personalizados a partir de la información proporcionada por el usuario.
### ¿Cómo funciona?
El usuario registrado rellena un formulario con información específica de cada documento. Este formulario es procesado en el servidor, generando una o varias peticiones para un modelo de lenguaje, con un prompt generado en base al formulario. El servidor genera un documento en formato HTML y se lo entrega al usuario. 
## Prácticas involucradas
- [Práctica 1: Tienda Estática](/wiki/Practica-1--Diseño-y-servido-estático)
- [Práctica 2: Funcionalidad de AI-Scribe](/wiki/Practica-2--Funcionalidad-de-AI-Scribe)

## Tecnologías Implicadas
- Servidor Web con Node.js vanilla, sin utilizar Express. 
- Frontend Web utilizando React.js para las páginas servidas de forma estática, y HTML + Vanilla JavaScript para las páginas generadas al vuelo.
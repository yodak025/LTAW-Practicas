---
layout: ../../layouts/WikiLayout.astro
title: "Practica 4 - Documentación Técnica"
---

# Práctica 4: Documentación Técnica

## Objetivos
Se ha buscado crear una experiencia asequible para los usuarios a la hora de hostear partidas de Kill Two Birds with One Stone en una red local. Esta práctica no ha podido cumplir con el objetivo inicial, que era detectar la red wifi y generar códigos QR escaneables que, al ser escaneados, conecten al usuario con el servidor creando una sala. El servidor debería servir entonces una versión del juego dentro de la sala con el rol asociado a su QR. Queda propuesto como mejora.

## Funcionalidades
Se han implementado las siguientes funcionalidades
- Servidor manejado desde electron, con interfaz propia.
- Interfaz propia basada en componentes, reutilizando la arquitectura utilizada en el cliente.
- La aplicación accede al sistema operativo y ofrece información sobre este, así como sobre el propio programa
- El programa permite modificar las constantes del juego, afectando a la ejecución actual. 
- El programa permite ejecutar el cliente de forma nativa. 


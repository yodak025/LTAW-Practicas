import React from 'react';
import App from '../components/App.jsx';
import { hydrateRoot } from 'react-dom/client';

/**  
 * Este código se ejecuta en el cliente y se encarga de hidratar la aplicación React. 
 * Este script se empaqueta, generando un archivo bundle.js que es solicitado por el cliente HTML.
 * La función hydrateRoot se encarga de tomar el HTML generado por el servidor y "hidratarlo" con React,
 * lo que significa que React toma el control de los elementos HTML ya existentes en la página.
*/

// Accedemos a las props de la aplicación que son almacenadas en el HTML.
const initialState = window.__INITIAL_STATE__;

hydrateRoot(document.getElementById('root'), <App props={initialState}/>);
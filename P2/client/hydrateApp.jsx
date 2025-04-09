import App from '../components/App.jsx';
import React from 'react'; 
import { hydrateRoot } from 'react-dom/client';

const initialState = window.__INITIAL_STATE__;

hydrateRoot(document.getElementById('root'), <App content={initialState.content}/>);
import App from '../components/pages/App.jsx';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
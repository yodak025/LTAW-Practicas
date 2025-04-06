import LoginPage from '../components/pages/Login.jsx';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <LoginPage />);
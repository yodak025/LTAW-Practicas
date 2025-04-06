import ProductPage from '../components/pages/ProductPage.jsx';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <ProductPage />);
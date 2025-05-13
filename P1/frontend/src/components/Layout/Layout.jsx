import React from 'react';
import Nav from '../Nav/Nav'
import './Layout.css'

/**
 * Componente de layout que define la estructura básica de la aplicación.
 * @param {Object} props - Props del componente.
 * @param {ReactNode} props.children - Contenido a mostrar dentro del layout. 
 * @returns {JSX.Element} - Un elemento que representa el layout de la aplicación.
 * @description
 * Este componente incluye la barra de navegación y el pie de página.
 * El contenido principal se renderiza entre la barra de navegación y el pie de página.
 */

function Layout({ children }) {
  return (
    <>
      <Nav className="os-layout-nav"/>
      <main>
        {children}
      </main>

      <footer className='os-layout-footer'>
        <p>
        <s>ⓒ</s> 2025 Yodak025 . No Rights Reserved 
        </p>
      </footer>
    </>
  );
}

export default Layout;
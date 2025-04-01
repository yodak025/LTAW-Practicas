import React from "react";
import './Nav.css';

export default function Nav({className}) {

  return (
    <nav className={className + ' os-nav'}>
      <header className="os-nav-header">
        Menú de Navegación
      </header>

      <main className="os-nav-options">
          <a href="index.html#products">Productos</a>
          <a href="index.html">Sobre Nosotros</a>
      </main>
    </nav>
  );
}

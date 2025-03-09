import React from "react";
import './Nav.css';

export default function Nav({className}) {

  return (
    <nav className={className + ' os-nav'}>
      <header className="os-nav-header">
        Menú de Navegación
      </header>

      <main className="os-nav-options">
          <a href="index.html">Productos</a>
          <a>Sobre Nosotros</a>
      </main>
    </nav>
  );
}

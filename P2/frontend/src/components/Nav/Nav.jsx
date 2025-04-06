import React from "react";
import './Nav.css';

function StaticNav({className}) {

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

export default function Nav({className}) {

  return (
    <nav className={className + ' os-nav'}>
      <header className="os-nav-header">
        <p>Menú de Navegación</p>
        <a href="index.html#products">Productos</a>
        <a href="index.html">Sobre Nosotros</a>
      </header>

      <section>
          <input type="text" placeholder="Buscar..." />
      </section>
      <section className="os-nav-options">
          <img src="" alt="Logo" className="os-nav-github" />
          <a>Usuario</a>
      </section>
    </nav>
  );
}

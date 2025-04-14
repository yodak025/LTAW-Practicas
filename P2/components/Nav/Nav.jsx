import React from "react";

function NavContent({ isLoggedIn }) {
  if (isLoggedIn) {
    return (
      <>
        <section>
          <input type="text" placeholder="Buscar..." />
        </section>
        <section className="os-nav-options">
          <img src="" alt="Logo" className="os-nav-github" />
          <a>Usuario</a>
        </section>
      </>
    );
  }
  return;
}

export default function Nav({ className }) {
  return (
    <nav className={className + " os-nav"}>
      <header className="os-nav-header">AI - Scribe</header>

      <main className="os-nav-options">
        <a href="index.html#products">Productos</a>
        <a href="index.html">Sobre Nosotros</a>
      </main>
      {NavContent({ isLoggedIn: true })}
    </nav>
  );
}

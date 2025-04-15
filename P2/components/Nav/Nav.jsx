import React, { useState, useCallback } from "react";

const toggleTheme = () => {
  const m = new XMLHttpRequest();
  m.onreadystatechange = () => {
    if (m.readyState === 4) {
      console.log("Peticion ToggleTheme");
      console.log("status: " + m.status);
      if (m.status === 200) {
        window.location.reload();
      }
    }
  };

  m.open("GET", `/toggle-theme`, true);
  m.setRequestHeader("Content-Type", "text/plain");
  m.send();
  console.log("Peticion ToggleTheme enviada");

}

function NavContent({ user }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const toggleUserDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowUserDropdown(prev => !prev);
    setShowMenuDropdown(false);
  }, []);

  const toggleMenuDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowMenuDropdown(prev => !prev);
    setShowUserDropdown(false);
  }, []);


  if (user) {
    return (
      <>
        <header className="os-nav-header">
          <div className="os-dropdown">
            <div className="os-dropdown-trigger" onClick={toggleMenuDropdown}>
              AI - Scribe
            </div>
            {showMenuDropdown && (
              <div className="os-dropdown-content">
                <a href="index.html#products">Productos</a>
                <a href="index.html">Sobre Nosotros</a>
              </div>
            )}
          </div>
        </header>

        <section className="os-nav-search">
          <input type="text" placeholder="Buscar..." />
        </section>

        <section className="os-nav-options">
          <div className="os-dropdown --user">
            <div className="os-dropdown-trigger" onClick={toggleUserDropdown}>
              <span>{user}</span>
            </div>
            {showUserDropdown && (
              <div className="os-dropdown-content">
                <a href="#cart">Carrito</a>
                <a href="" onClick={ toggleTheme }>Cambiar Tema</a>
                <a href="#settings">Configuración</a>
                <a href="/logout">LogOut</a>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
  return null;
}

export default function Nav({ user }) {
  return (
    <nav className={"os-layout-nav os-nav"}>
      <NavContent user={user} />
    </nav>
  );
}

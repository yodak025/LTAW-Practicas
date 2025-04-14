import React, { useState } from "react";

function NavContent({ isLoggedIn }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowMenuDropdown(false);
  };

  const toggleMenuDropdown = () => {
    setShowMenuDropdown(!showMenuDropdown);
    setShowUserDropdown(false);
  };

  if (isLoggedIn) {
    return (
      <>
        <header className="os-nav-header">
          <div 
            className={`os-nav-clickable title-container ${showMenuDropdown ? 'active' : ''}`}
            onClick={toggleMenuDropdown}
          >
            <div className="os-nav-dropdown">
              <span className="os-nav-dropdown-trigger">AI - Scribe</span>
              {showMenuDropdown && (
                <div className="os-nav-dropdown-content menu-dropdown">
                  <a href="index.html#products">Productos</a>
                  <a href="index.html">Sobre Nosotros</a>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <section className="os-nav-search">
          <input type="text" placeholder="Buscar..." />
        </section>

        <section className="os-nav-options os-nav-user">
          <div 
            className={`os-nav-clickable user-container ${showUserDropdown ? 'active' : ''}`}
            onClick={toggleUserDropdown}
          >
            <div className="os-nav-dropdown">
              <div className="user-content">
                <img src="" alt="Logo" className="os-nav-github" />
                <span className="os-nav-dropdown-trigger">Usuario</span>
              </div>
              {showUserDropdown && (
                <div className="os-nav-dropdown-content user-dropdown">
                  <a href="#cart">Carrito</a>
                  <a href="#settings">Configuración</a>
                  <a href="#logout">LogOut</a>
                </div>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
  return null;
}

export default function Nav({ className, isLoggedIn = true }) {
  return (
    <nav className={className + " os-nav"}>
      {NavContent({ isLoggedIn })}
    </nav>
  );
}

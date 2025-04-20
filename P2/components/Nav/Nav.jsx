import React, { useState, useCallback, useEffect, useRef } from "react";
import Cart from './Cart';

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
};

function NavContent({ user }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
        setShowMenuDropdown(false);
        setShowSearchDropdown(false);
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleUserDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowUserDropdown((prev) => !prev);
    setShowMenuDropdown(false);
    setShowCartDropdown(false);
    setShowSearchDropdown(false);
  }, []);

  const toggleMenuDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowMenuDropdown((prev) => !prev);
    setShowUserDropdown(false);
    setShowCartDropdown(false);
    setShowSearchDropdown(false);
  }, []);

  const toggleCartDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowCartDropdown((prev) => !prev);
    setShowUserDropdown(false);
    setShowMenuDropdown(false);
    setShowSearchDropdown(false);
  }, []);

  const handleSearch = (e) => {
    const m = new XMLHttpRequest();
    m.onreadystatechange = () => {
      if (m.readyState === 4) {
        console.log("Peticion Search");
        console.log("status: " + m.status);
        if (m.status === 200) {
          const response = JSON.parse(m.responseText);
          setSearchValue(response);
          setShowCartDropdown(false);
          setShowUserDropdown(false);
          setShowMenuDropdown(false);
          if (response.length === 0 || e.target.value.length < 3) {
            setShowSearchDropdown(false);
          } else {
            setShowSearchDropdown(true);
          }
        }
      }
    };
    m.open("GET", `/search?q=${e.target.value}`, true);
    m.setRequestHeader("Content-Type", "text/plain");
    m.send();
    console.log("Peticion Search enviada");
  };

  if (user) {
    return (
      <>
        <header className="os-nav-header" ref={dropdownRef}>
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

        <section className="os-nav-search" ref={dropdownRef}>
          <input type="text" placeholder="Buscar..." onChange={handleSearch} />
          {showSearchDropdown && (
            <div className="os-dropdown-content">
              {searchValue.map((product) => {
                return (
                  <a href={`/product.html?type=${product.id}`}>
                    {product.name}
                  </a>
                );
              })}
            </div>
          )}
        </section>

        <section className="os-nav-options">
          <div className="os-dropdown --cart" ref={dropdownRef}>
            <div className="os-dropdown-trigger" onClick={toggleCartDropdown}>
              <span>Carrito</span>
            </div>
            {showCartDropdown && (
              <div className="os-dropdown-content">
                <Cart />
              </div>
            )}
          </div>
          <div className="os-dropdown --user" ref={dropdownRef}>
            <div className="os-dropdown-trigger" onClick={toggleUserDropdown}>
              <span>{user}</span>
            </div>
            {showUserDropdown && (
              <div className="os-dropdown-content">
                <a href="#cart">Carrito</a>
                <a href="" onClick={toggleTheme}>
                  Cambiar Tema
                </a>
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

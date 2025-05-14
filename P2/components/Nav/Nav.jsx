import React, { useState, useCallback, useEffect, useRef } from "react";
import Cart from './Cart';

/**
 * @funtion toggleTheme
 * @description
 * Función que cambia el tema de la aplicación.
 * Realiza una petición AJAX al servidor para cambiar el tema.
 * Recarga la página una vez se ha cambiado el tema.
 * @returns {void}
 */

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

/**
 * @component NavContent
 * @description
 * Componente que renderiza el contenido de la barra de navegación.
 * Contiene el menú de navegación, la barra de búsqueda y las opciones de usuario.
 * También maneja el estado de los dropdowns y las peticiones AJAX.
 * @param {Object} props
 * @param {string} props.user - Nombre del usuario 
 * @returns {JSX.Element} 
 */

function NavContent({ user }) {
  // Estados para controlar la visibilidad de los diferentes menús desplegables
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState([]);

  // Referencias para detectar clics fuera de los menús desplegables
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    // Cierra todos los menús desplegables cuando se hace clic fuera de ellos
    // Implementa un pequeño retardo para evitar conflictos con los eventos de clic
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target) &&
          !searchRef.current?.contains(event.target) &&
          !cartRef.current?.contains(event.target) &&
          !userRef.current?.contains(event.target)) {
        setTimeout(() => {
          setShowUserDropdown(false);
          setShowMenuDropdown(false);
          setShowSearchDropdown(false);
          setShowCartDropdown(false);
        }, 100);
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
    if (e.target.value.length < 3) {
      setShowSearchDropdown(false);
      return;
    }
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

  return (
    <>
      <header className="os-nav-header" ref={menuRef}>
        <div className="os-dropdown">
          <div className="os-dropdown-trigger" onClick={toggleMenuDropdown}>
            📄 AI - Scribe
          </div>
          {showMenuDropdown && (
            <div className="os-dropdown-content">
              <a href="index.html#products">Productos</a>
              <a href="index.html">Sobre Nosotros</a>
            </div>
          )}
        </div>
      </header>

      <section className="os-nav-search" ref={searchRef}>
        <input type="text" placeholder="🔍 Buscar..." onChange={handleSearch} />
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
        {user ? (
          <>
            <div className="os-dropdown --cart" ref={cartRef}>
              <div className="os-dropdown-trigger" onClick={toggleCartDropdown}>
                <span>🛒 Carrito</span>
              </div>
              {showCartDropdown && (
                <div className="os-dropdown-content">
                  <Cart />
                </div>
              )}
            </div>
            <div className="os-dropdown --user" ref={userRef}>
              <div className="os-dropdown-trigger" onClick={toggleUserDropdown}>
                <span>{"👤 " + user}</span>
              </div>
              {showUserDropdown && (
                <div className="os-dropdown-content">
                  <a href="/my-documents.html">Mis Documentos</a>
                  <a href="" onClick={toggleTheme}>
                    Cambiar Tema
                  </a>
                  <a href="/logout">Cerrar Sesión</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="os-dropdown --user">
            <a href="/login.html" className="os-dropdown-trigger">
              <span>👤 Iniciar sesión</span>
            </a>
          </div>
        )}
      </section>
    </>
  );
}

export default function Nav({ user }) {
  return (
    <nav className={"os-layout-nav os-nav"}>
      <NavContent user={user} />
    </nav>
  );
}

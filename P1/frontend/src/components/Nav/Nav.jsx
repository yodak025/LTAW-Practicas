import './Nav.css';

/**
 * Componente de navegación que representa la barra de navegación de la aplicación.
 * @param {Object} props - Props del componente.
 * @param {string} props.className - Clase CSS adicional para el componente.
 * @returns {JSX.Element} - Un elemento que representa la barra de navegación.
 * @description
 * Este componente incluye un encabezado y enlaces a diferentes secciones de la aplicación.
 */

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

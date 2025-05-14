import React from "react";
import { ForwardArrow, BackwardArrow } from "./Arrow";
import { useState, useEffect, useRef } from "react";

const ANIMATION_DURATION = 300; //!-- Debe ser consistente con la duración de la transición CSS

/**
 * Componente de categoría que muestra productos en una interfaz de usuario.
 * @component
 * @param {object} props - Props del componente.
 * @param {string} props.name - Nombre de la categoría.
 * @param {ReactNode} props.children - Productos a mostrar.
 * @returns {JSX.Element} - Un elemento que representa la categoría y sus productos.
 * @description
 * Este componente maneja la visualización de productos en una categoría específica.
 * Permite la navegación entre productos utilizando botones de retroceso y avance.
 * La cantidad de productos visibles se adapta al tamaño de la ventana.
 */

export default function Category({ name, children }) {
  //-- Se crean estados para manejar la página actual, la cantidad de productos por página y el estado del la animación
  const [currentPage, setCurrentPage] = useState(0); //-- Controla la página actual
  const [productsPerPage, setProductsPerPage] = useState(1); //-- Controla la cantidad de productos por página
  const [isAnimating, setIsAnimating] = useState(null);
  //-- Se crea una referencia para el contenedor de productos
  const containerRef = useRef(null);

  //-- Array de productos, necesario para el manejo de los productos
  //-- Si children es un array, lo asigna a productArray, si no, lo asigna a un array con children
  const productArray = Array.isArray(children) ? children : [children];

  //-- Calcula el total de páginas que se pueden mostrar
  //?-- Si hay n productos y se muestran x productos por página, se pueden mostrar n - (x - 1) páginas
  const totalPages = productArray.length - (productsPerPage - 1);

  //-- Calcula cuantos productos caben en el contenedor
  useEffect(
    () => {
      const calculateVisibleProducts = () => {
        if (!containerRef.current) return; 
        //-- Calcula el ancho de la parte del contenedor que no ocupan los botones
        const containerWidth = containerRef.current.clientWidth;
        const buttonWidth = 100; // Approximate width of both buttons 
        const availableWidth = containerWidth - buttonWidth;

        //-- Calcula el tamaño de un producto 
        const viewportHeight = window.innerHeight;
        const productWidth = (38 * viewportHeight) / 100 + 10;

        //-- Calcula cuantos productos caben en el contenedor
        const fittingProducts = Math.max(
          1,
          Math.floor(availableWidth / productWidth)
        );
        setProductsPerPage(fittingProducts); //-- Actualiza la cantidad de productos por página en el estado
      };

      calculateVisibleProducts(); //-- Calcula los productos visibles en el primer renderizado.
      window.addEventListener("resize", calculateVisibleProducts); //-- Si se redimensiona la ventana, recalcula los productos visibles

      return () =>
        window.removeEventListener("resize", calculateVisibleProducts); //-- Se borra el evento de resize si el componente se desmonta
    },
    [] //-- Solo se ejecuta una vez para evitar que se recalcule con cada cambio de estado.
  );

  //-- Manejo de los botones de navegación
  const handleBackward = () => {
    if (isAnimating) return;
    setIsAnimating("backward");
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(0, prev - 1));
      setIsAnimating(null);
    }, ANIMATION_DURATION);
  };

  const handleForward = () => {
    if (isAnimating) return;
    setIsAnimating("forward");
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
      setIsAnimating(null);
    }, ANIMATION_DURATION);
  };

  // Selección de los productos a mostrar
  const startIndex = currentPage;
  const visibleProducts = productArray.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Clases para la animación
  const slideAnimationClass = isAnimating ? `--${isAnimating}` : "";

  return (
    <main className="os-category">
      <h2 className="os-category-title">{name}</h2>
      <section className="os-category-productsContainer" ref={containerRef}>
        <button
          className="os-category-btn --backward"
          onClick={handleBackward}
          disabled={currentPage === 0 || isAnimating}
        >
          <BackwardArrow 
            className="os-category-btn-icon" 
            disabled={currentPage === 0 || isAnimating}
          />
        </button>
        <section
          className={`os-category-slidingContainer ${slideAnimationClass}`}
        >
          {visibleProducts}
        </section>
        <button
          className="os-category-btn --forward"
          onClick={handleForward}
          disabled={currentPage >= totalPages - 1 || isAnimating}
        >
          <ForwardArrow 
            className="os-category-btn-icon" 
            disabled={currentPage >= totalPages - 1 || isAnimating}
          />
        </button>
      </section>
    </main>
  );
}

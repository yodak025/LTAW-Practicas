import React from 'react';

const Cart = () => {
  // Objeto para mapear nombres a títulos basado en tienda.json
  const productMap = {
    'curriculum-vitae': 'Currículum Vitae Personalizado',
    'carta-presentacion': 'Carta de Presentación',
    'resumen-ejecutivo': 'Resumen Ejecutivo',
    'descripcion-producto': 'Descripción de Producto',
    'email-ventas': 'Email de Ventas',
    'carta-recomendacion': 'Carta de Recomendación',
    'revisar-redaccion': 'Revisar Redacción',
    'resumir-texto': 'Resumir Texto',
    'esquematizar-texto': 'Esquematizar Texto',
    'extender-texto': 'Extender Texto',
    'prensar-latex': 'Prensar Texto'
  };

  const parseCartCookie = () => {
    const cookies = document.cookie.split(';');
    const cartCookie = cookies.find(cookie => cookie.trim().startsWith('cart='));
    
    if (!cartCookie) return null;
    
    const cartContent = cartCookie.trim().substring(5); // Elimina 'cart='
    const items = cartContent.split('&');
    
    return items.map(item => {
      const [, tipo] = item.split(':');
      return tipo;
    });
  };

  const cartItems = parseCartCookie();

  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty">Carrito vacío</div>;
  }

  return (
    <div className="cart-items">
      <ul>
        {cartItems.map((tipo, index) => (
          <li key={index} className="cart-item">
            <span className="cart-item-title">
              {productMap[tipo] || tipo}
            </span>
            <button 
              className="cart-item-remove" 
              aria-label="Eliminar del carrito"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
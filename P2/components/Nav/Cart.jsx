import React from 'react';

const Cart = () => {
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
          <li key={index}>{tipo}</li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
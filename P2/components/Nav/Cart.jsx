import React, { useState, useEffect } from "react";

// Modal de confirmación reutilizable
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <p>{message}</p>
        <div className="cart-modal-buttons">
          <button className="cart-modal-button confirm" onClick={onConfirm}>
            Aceptar
          </button>
          <button className="cart-modal-button cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    callback: null,
  });

  // Función para obtener cookies actuales
  const getCookies = () => {
    return document.cookie.split(";").reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = value || "";
      return cookies;
    }, {});
  };

  // Función para cargar los elementos del carrito
  useEffect(() => {
    const loadCartItems = () => {
      const cookies = getCookies();
      const cartContent = cookies.cart;
      
      if (!cartContent) {
        setCartItems([]);
        return;
      }
      
      const items = cartContent.split("&");
      const parsedItems = items.map((item) => {
        const [, tipo] = item.split(":");
        return tipo;
      });
      
      setCartItems(parsedItems);
    };
    
    loadCartItems();
  }, []);

  // Función para modificar la cookie
  const updateCartCookie = (indexes = []) => {
    const cookies = getCookies();
    const cartContent = cookies.cart;
    
    if (!cartContent) return;
    
    let items = cartContent.split("&");
    
    // Si indices está vacío, eliminar todo el carrito
    if (indexes.length === 0) {
      document.cookie = `cart=; path=/; max-age=0`;
      setCartItems([]);
      return;
    }
    
    // Eliminar elementos por índice en orden descendente
    indexes
      .sort((a, b) => b - a)
      .forEach((index) => {
        items.splice(index, 1);
      });
    
    // Actualizar cookie y estado local
    if (items.length > 0) {
      const newCartContent = items.join("&");
      document.cookie = `cart=${newCartContent}; path=/`;
      
      // Actualizar el estado local con los nuevos elementos
      const newCartItems = items.map((item) => {
        const [, tipo] = item.split(":");
        return tipo;
      });
      
      setCartItems(newCartItems);
    } else {
      document.cookie = `cart=; path=/; max-age=0`;
      setCartItems([]);
    }
  };

  const handleRemoveItem = (index) => {
    setModalConfig({
      isOpen: true,
      message:
        "¿Estás seguro de que deseas eliminar este elemento del carrito?",
      callback: () => updateCartCookie([index]),
    });
  };

  const handleEmptyCart = () => {
    setModalConfig({
      isOpen: true,
      message: "¿Estás seguro de que deseas vaciar todo el carrito?",
      callback: () => updateCartCookie([]),
    });
  };

  const handleModalCancel = () => {
    setModalConfig({ isOpen: false, message: "", callback: null });
  };

  const handleModalConfirm = () => {
    if (modalConfig.callback) {
      modalConfig.callback();
    }
    handleModalCancel();
  };

  const productMap = {
    "curriculum-vitae": "Currículum Vitae Personalizado",
    "carta-presentacion": "Carta de Presentación",
    "resumen-ejecutivo": "Resumen Ejecutivo",
    "descripcion-producto": "Descripción de Producto",
    "email-ventas": "Email de Ventas",
    "carta-recomendacion": "Carta de Recomendación",
    "revisar-redaccion": "Revisar Redacción",
    "resumir-texto": "Resumir Texto",
    "esquematizar-texto": "Esquematizar Texto",
    "extender-texto": "Extender Texto",
    "prensar-latex": "Prensar Texto",
  };

  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty">Carrito vacío</div>;
  }

  return (
    <div className="cart-items">
      <ul>
        {cartItems.map((tipo, index) => (
          <li key={index} className="cart-item">
            <span className="cart-item-title">{productMap[tipo] || tipo}</span>
            <button
              className="cart-item-remove"
              aria-label="Eliminar del carrito"
              onClick={() => handleRemoveItem(index)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button className="cart-empty-button" onClick={handleEmptyCart}>
        Vaciar Carrito
      </button>
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default Cart;

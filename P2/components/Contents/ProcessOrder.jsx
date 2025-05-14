import React, { useState, useEffect } from "react";

/**
 * @component OrderItem
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de producto
 * @param {string} props.title - Título del producto 
 * @returns {JSX.Element} - Un elemento que representa un artículo del pedido.
 */

const OrderItem = ({ type, title }) => (
  <div className="os-order-item">
    <span className="os-order-item-title">{title}</span>
  </div>
);

/** 
 * @component PaymentModal
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal está abierto o cerrado
 * @param {function} props.onConfirm - Función a ejecutar al confirmar el pedido
 * @param {function} props.onCancel - Función a ejecutar al cancelar el pedido
 * @returns {JSX.Element} - Un elemento que representa el modal de pago.
 */ 

const PaymentModal = ({ isOpen, onConfirm, onCancel }) => {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    const m = new XMLHttpRequest();
    m.onreadystatechange = () => {
      if (m.readyState === 4) {
        console.log("Peticion NewOrder");
        console.log("status: " + m.status);
        if (m.status === 200) {
          setSuccess(true);
        }
      }
    };

    m.open("GET", `/new-order?mail=${email}&card=${cardNumber}`, true);
    m.setRequestHeader("Content-Type", "text/plain");
    m.send();
  };

  if (!isOpen) return null;

  return (
    <div className="os-modal-overlay">
      <div className="os-modal">
        {!success ? (
          <>
            <h2>Finalizar Pedido</h2>
            <div className="os-modal-form">
              <div className="os-modal-field">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="os-modal-field">
                <label htmlFor="cardNumber">Número de Tarjeta:</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="os-modal-buttons">
                <button className="os-modal-button cancel" onClick={onCancel}>
                  Cancelar
                </button>
                <button className="os-modal-button confirm" onClick={handleSubmit}>
                  Proceder
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="os-modal-success">
            <h2>¡Pedido Realizado con Éxito!</h2>
            <button className="os-modal-button confirm" onClick={() => window.location.href = "/"}>
              Página Principal
            </button>
            <button className="os-modal-button confirm" onClick={() => window.location.href = "/my-documents.html"}>
              Mis documentos 
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @component ProcessOrder
 * @description Componente principal que maneja el proceso de pedido.
 * @returns {JSX.Element} - Un elemento que representa el proceso de pedido.
 * @description
 * Este componente muestra un resumen del pedido y permite al usuario proceder al pago.
 * Los artículos del pedido se obtienen de una cookie llamada "cart".
 * Al hacer clic en "Tramitar Pedido", se abre un modal donde el usuario puede 
 * ingresar su correo electrónico y número de tarjeta.
 * Al confirmar el pedido, se envía una solicitud al servidor para procesar el pedido.
 * Si el pedido se procesa con éxito, se muestra un mensaje de éxito y se ofrecen opciones 
 * para volver a la página principal o a la sección de documentos generados.
 */

export default function ProcessOrder() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const cartCookie = document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("cart="));
    if (cartCookie) {
      const cartContent = cartCookie.split("=")[1];
      const items = cartContent.split("&").map((item) => {
        const [, tipo] = item.split(":");
        return tipo;
      });
      setCartItems(items);
    }
  }, []);

  return (
    <div className="os-process-order">
      <h2>Resumen del Pedido</h2>
      <div className="os-order-items">
        {cartItems.map((type, index) => (
          <OrderItem 
            key={index} 
            type={type}
            title={productMap[type] || type}
          />
        ))}
      </div>
      <button 
        className="os-process-button"
        onClick={() => setShowModal(true)}
      >
        Tramitar Pedido
      </button>
      <PaymentModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
      />
    </div>
  );
}
import React from 'react';

const MyDocuments = ({ documents }) => {
  // Use the same product mapping dictionary as in Cart.jsx and ProcessOrder.jsx
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

  const handleViewDocument = (id) => {
    window.location.href = `/document.html?id=${id}`;
  };

  return (
    <div className="os-my-documents">
      <div className="os-my-documents-header">
        <h2>Mis Documentos</h2>
        <p>Aquí puedes ver todos tus documentos generados</p>
      </div>
      
      {documents && documents.length > 0 ? (
        <div className="os-document-list">
          {documents.map((doc, idx) => (
            <div key={idx} className="os-document-item">
              <div className="os-document-info">
                <h3 className="os-document-title">{productMap[doc.type] || doc.type}</h3>
                <span className="os-document-id">ID: {doc.index}</span>
              </div>
              <button 
                className="os-document-view-btn" 
                onClick={() => handleViewDocument(doc.index)}
              >
                Ver Documento
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="os-documents-empty">
          <p>No tienes documentos generados</p>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
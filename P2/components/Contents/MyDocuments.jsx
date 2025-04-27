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

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Fecha incorrecta';
    
    // Format date: "10 de Mayo, 2023 - 14:30"
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-ES', options);
  };

  const handleViewDocument = (id) => {
    window.location.href = `/document.html?id=${id}`;
  };

  // Sort documents by date, newest first
  const sortedDocuments = documents && documents.length > 0 
    ? [...documents].sort((a, b) => {
        // Default dates if missing
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        // Sort descending (newest first)
        return dateB - dateA;
      })
    : [];

  return (
    <div className="os-my-documents">
      <div className="os-my-documents-header">
        <h2>Mis Documentos</h2>
        <p>Aquí puedes ver todos tus documentos generados</p>
      </div>
      
      {documents && documents.length > 0 ? (
        <div className="os-document-list">
          {sortedDocuments.map((doc, idx) => (
            <div key={idx} className="os-document-item">
              <div className="os-document-info">
                <h3 className="os-document-title">{productMap[doc.type] || doc.type}</h3>
                <span className="os-document-date">{formatDate(doc.date)}</span>
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
import React from 'react';

const Document = ({ structure }) => { //TODO - Mejor con children
  const renderText = (text) => {
    // Dividir el texto en párrafos y filtrar los párrafos vacíos
    const paragraphs = text.split('\\n').filter(p => p.trim() !== '');
    
    if (paragraphs.length === 0) return null;
    
    // Si solo hay un párrafo, devolverlo directamente
    if (paragraphs.length === 1) {
      return <p className="document-text">{paragraphs[0]}</p>;
    }
    
    // Si hay múltiples párrafos, renderizar cada uno
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="document-text">
        {paragraph}
      </p>
    ));
  };

  const renderContent = (content, level = 1) => {
    if (typeof content === 'string') {
      return renderText(content);
    }

    if (typeof content === 'object' && content !== null) {
      return Object.entries(content).map(([title, value], index) => {
        const HeadingTag = `h${Math.min(level, 3)}`;
        
        return (
          <div key={index} className={`document-section level-${level}`}>
            <HeadingTag className={`document-title level-${level}`}>
              {title}
            </HeadingTag>
            {renderContent(value, level + 1)}
          </div>
        );
      });
    }

    return null;
  };

  return (
    <div className="document-container">
      {renderContent(structure)}
    </div>
  );
};

export default Document;
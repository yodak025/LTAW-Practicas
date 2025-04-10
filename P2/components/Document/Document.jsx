import React from 'react';

const Document = ({ structure }) => {
  const renderContent = (content, level = 1) => {
    if (typeof content === 'string') {
      return <p className="document-text">{content}</p>;
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
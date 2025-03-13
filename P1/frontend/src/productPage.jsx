import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import Nav from './components/Nav/Nav'
import "./App.css"
import "./productPage.css"


const ProductPage = () => {

  const [formData, setFormData] = useState({
    title: '',
    category: 'professional',
    tone: 'formal',
    sections: ['introduction', 'main-content', 'conclusion'],
    mainContent: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox selections for sections
      const updatedSections = checked 
        ? [...formData.sections, name]
        : formData.sections.filter(section => section !== name);
      
      setFormData({...formData, sections: updatedSections});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generating document with:", formData);
    // Here you would send the data to your backend or process it
  };
  return(
    <Layout>
      <div className="os-document-form-container">
        <h1 className="os-document-title">Generador de Documentos</h1>
        
        <form className="os-document-form" onSubmit={handleSubmit}>
          <section className="os-form-section">
            <h2>Información Básica</h2>
            
            <div className="os-form-field">
              <label htmlFor="title">Título del Documento:</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="os-form-field">
              <label>Categoría:</label>
              <ul className="os-bullet-options">
                <li>
                  <input 
                    type="radio" 
                    id="professional" 
                    name="category" 
                    value="professional"
                    checked={formData.category === 'professional'}
                    onChange={handleChange}
                  />
                  <label htmlFor="professional">Profesional</label>
                </li>
                <li>
                  <input 
                    type="radio" 
                    id="academic" 
                    name="category" 
                    value="academic"
                    checked={formData.category === 'academic'}
                    onChange={handleChange}
                  />
                  <label htmlFor="academic">Académico</label>
                </li>
                <li>
                  <input 
                    type="radio" 
                    id="creative" 
                    name="category" 
                    value="creative"
                    checked={formData.category === 'creative'}
                    onChange={handleChange}
                  />
                  <label htmlFor="creative">Creativo</label>
                </li>
              </ul>
            </div>
          </section>

          <section className="os-form-section">
            <h2>Estilo y Tono</h2>
            
            <div className="os-form-field">
              <label>Tono del documento:</label>
              <select 
                name="tone" 
                value={formData.tone}
                onChange={handleChange}
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="technical">Técnico</option>
                <option value="persuasive">Persuasivo</option>
              </select>
            </div>

            <div className="os-form-field">
              <label>Secciones a incluir:</label>
              <ul className="os-bullet-options">
                <li>
                  <input 
                    type="checkbox" 
                    id="introduction" 
                    name="introduction"
                    checked={formData.sections.includes('introduction')}
                    onChange={handleChange}
                  />
                  <label htmlFor="introduction">Introducción</label>
                </li>
                <li>
                  <input 
                    type="checkbox" 
                    id="main-content" 
                    name="main-content"
                    checked={formData.sections.includes('main-content')}
                    onChange={handleChange}
                  />
                  <label htmlFor="main-content">Contenido Principal</label>
                </li>
                <li>
                  <input 
                    type="checkbox" 
                    id="conclusion" 
                    name="conclusion"
                    checked={formData.sections.includes('conclusion')}
                    onChange={handleChange}
                  />
                  <label htmlFor="conclusion">Conclusión</label>
                </li>
                <li>
                  <input 
                    type="checkbox" 
                    id="references" 
                    name="references"
                    checked={formData.sections.includes('references')}
                    onChange={handleChange}
                  />
                  <label htmlFor="references">Referencias</label>
                </li>
              </ul>
            </div>
          </section>

          <section className="os-form-section">
            <h2>Contenido</h2>
            
            <div className="os-form-field">
              <label htmlFor="mainContent">Contenido Principal:</label>
              <textarea 
                id="mainContent" 
                name="mainContent" 
                rows="6"
                value={formData.mainContent}
                onChange={handleChange}
                placeholder="Escriba aquí la información principal que desea incluir en el documento..."
              ></textarea>
            </div>

            <div className="os-form-field">
              <label htmlFor="additionalNotes">Notas Adicionales:</label>
              <textarea 
                id="additionalNotes" 
                name="additionalNotes" 
                rows="3"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Instrucciones específicas o información adicional..."
              ></textarea>
            </div>
          </section>

          <button type="submit" className="os-product-btn">Generar Documento</button>
        </form>
      </div>
    </Layout>
  )
}


createRoot(document.getElementById('root')).render(
    <ProductPage />
)
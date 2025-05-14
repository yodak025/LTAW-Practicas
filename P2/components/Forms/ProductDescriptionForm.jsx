import React from "react";
import BaseForm from "./BaseForm";

/**
 * Componente para crear un formulario de una descripción de producto
 * @returns {JSX.Element} - Un elemento que representa el formulario 
 */

export default function ProductDescriptionForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Descripción de Producto</h2>
        <p>
          Esta herramienta te ayuda a crear una descripción de producto profesional y
          persuasiva. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Presentar un nuevo producto al mercado</li>
          <li>Mejorar la descripción de productos existentes</li>
          <li>Destacar beneficios y características clave</li>
          <li>Optimizar contenido para e-commerce</li>
        </ul>
      </section>

      <BaseForm type="descripcion-producto" submitText="Generar Descripción">
        {/* Título */}
        <section className="os-form-section">
          <h3>Identificación del Producto</h3>

          <div className="os-form-field">
            <label htmlFor="productName">Nombre del Producto:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              required
              placeholder="Nombre comercial del producto"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="subtitle">Subtítulo (opcional):</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              placeholder="Frase corta que complementa el nombre"
            />
          </div>
        </section>

        {/* Introducción */}
        <section className="os-form-section">
          <h3>Introducción</h3>

          <div className="os-form-field">
            <label htmlFor="keywordDescription">Descripción con palabras clave:</label>
            <textarea
              id="keywordDescription"
              name="keywordDescription"
              rows="4"
              required
              placeholder="Describe el producto incluyendo las palabras clave más relevantes"
            />
          </div>
        </section>

        {/* Características */}
        <section className="os-form-section">
          <h3>Características y Beneficios</h3>

          <div className="os-form-field">
            <label htmlFor="features">Listado de características:</label>
            <textarea
              id="features"
              name="features"
              rows="6"
              required
              placeholder="Enumera las características principales del producto"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="benefits">Beneficios para el usuario:</label>
            <textarea
              id="benefits"
              name="benefits"
              rows="6"
              required
              placeholder="Describe cómo el producto beneficia al usuario y qué lo hace único"
            />
          </div>
        </section>

        {/* Especificaciones Técnicas */}
        <section className="os-form-section">
          <h3>Especificaciones Técnicas (Opcional)</h3>

          <div className="os-form-field">
            <label htmlFor="technicalDetails">Detalles técnicos:</label>
            <textarea
              id="technicalDetails"
              name="technicalDetails"
              rows="6"
              placeholder="Incluye especificaciones técnicas relevantes"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="certifications">Certificaciones y garantías:</label>
            <textarea
              id="certifications"
              name="certifications"
              rows="4"
              placeholder="Menciona certificaciones, garantías o estándares que cumple el producto"
            />
          </div>
        </section>

        {/* Opiniones de Clientes */}
        <section className="os-form-section">
          <h3>Opiniones de Clientes</h3>

          <div className="os-form-field">
            <label htmlFor="reviews">Testimonios o valoraciones:</label>
            <textarea
              id="reviews"
              name="reviews"
              rows="6"
              required
              placeholder="Incluye testimonios o valoraciones de clientes que han usado el producto"
            />
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="os-form-section">
          <h3>Llamado a la Acción</h3>

          <div className="os-form-field">
            <label htmlFor="callToAction">Mensaje de llamado a la acción:</label>
            <textarea
              id="callToAction"
              name="callToAction"
              rows="4"
              required
              placeholder="Escribe un mensaje persuasivo que motive a la compra"
            />
          </div>
        </section>
      </BaseForm>
    </div>
  );
}
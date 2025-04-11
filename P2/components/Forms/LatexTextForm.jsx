import React from "react";
import BaseForm from "./BaseForm";

export default function LatexTextForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Convertir a LaTeX</h2>
        <p>
          Esta herramienta convierte tu texto a formato LaTeX, ideal para
          documentos académicos y científicos. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Preparar documentos para publicación académica</li>
          <li>Formatear ecuaciones y fórmulas matemáticas</li>
          <li>Crear documentos técnicos profesionales</li>
          <li>Generar bibliografías y referencias</li>
        </ul>
      </section>

      <BaseForm type="prensar-latex">
        <div className="os-form-field">
          <label htmlFor="originalText">Texto a Convertir:</label>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder="Introduce el texto que deseas convertir a LaTeX..."
            required
          />
        </div>

        <div className="os-form-field">
          <label htmlFor="documentClass">Clase de Documento:</label>
          <select id="documentClass" name="documentClass" required>
            <option value="article">Artículo</option>
            <option value="report">Reporte</option>
            <option value="book">Libro</option>
            <option value="beamer">Presentación</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="notes">Notas adicionales (opcional):</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Especifica cualquier requisito adicional para la conversión..."
          />
        </div>

        <button type="submit" className="os-form-submit">
          Convertir a LaTeX
        </button>
      </BaseForm>
    </div>
  );
}
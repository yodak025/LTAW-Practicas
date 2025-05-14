import React from "react";
import BaseForm from "./BaseForm";

/**
 * Componente para crear un formulario de un resumen de texto
 * @returns {JSX.Element} - Un elemento que representa el formulario 
 */

export default function SummarizeTextForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Resumir Texto</h2>
        <p>
          Esta herramienta te ayuda a crear un resumen conciso y efectivo de tu texto,
          manteniendo los puntos más importantes. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Extraer las ideas principales de un texto largo</li>
          <li>Crear resúmenes ejecutivos de documentos</li>
          <li>Sintetizar información compleja</li>
          <li>Generar extractos para presentaciones</li>
        </ul>
      </section>

      <BaseForm
        type="resumir-texto"
        submitText="Resumir Texto"
      >
        <div className="os-form-field">
          <label htmlFor="originalText">Texto a Resumir:</label>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder="Introduce el texto que deseas resumir..."
            required
          />
        </div>

        <div className="os-form-field">
          <label htmlFor="summaryLength">Longitud del Resumen:</label>
          <select id="summaryLength" name="summaryLength" required>
            <option value="very-short">Muy corto (25% del original)</option>
            <option value="short">Corto (50% del original)</option>
            <option value="medium">Medio (75% del original)</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="focusType">Tipo de Resumen:</label>
          <select id="focusType" name="focusType" required>
            <option value="key-points">Puntos clave</option>
            <option value="narrative">Narrativo</option>
            <option value="bullet-points">Lista de puntos</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="notes">Notas adicionales (opcional):</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Especifica cualquier requisito adicional para el resumen..."
          />
        </div>
      </BaseForm>
    </div>
  );
}
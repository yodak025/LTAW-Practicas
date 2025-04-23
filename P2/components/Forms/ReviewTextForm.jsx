import React from "react";
import BaseForm from "./BaseForm";

export default function ReviewTextForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Revisión de Texto</h2>
        <p>
          Esta herramienta te ayuda a mejorar la redacción de tu texto
          ajustándola al tono deseado. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Adaptar el lenguaje a un contexto específico</li>
          <li>Mantener consistencia en el tono del texto</li>
          <li>Mejorar la claridad y efectividad del mensaje</li>
          <li>Corregir errores gramaticales y de estilo</li>
        </ul>
      </section>

      <BaseForm type="revisar-redaccion" submitText="Revisar Texto">
        <div className="os-form-field">
          <label htmlFor="originalText">Texto a Revisar:</label>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder="Introduce el texto que deseas revisar..."
            required
          />
        </div>

        <div className="os-form-field">
          <label htmlFor="toneStyle">Tono Deseado:</label>
          <select id="toneStyle" name="toneStyle" required>
            <option value="informal">
              Informal - Cercano y conversacional
            </option>
            <option value="academic">Académico - Formal y técnico</option>
            <option value="business">
              Empresarial - Profesional y conciso
            </option>
          </select>
        </div>
      </BaseForm>
    </div>
  );
}

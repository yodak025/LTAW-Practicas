import React from "react";
import BaseForm from "./BaseForm";

export default function ExtendTextForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Expansión de Texto</h2>
        <p>
          Esta herramienta te ayuda a expandir un texto manteniendo su esencia y
          significado original. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Desarrollar ideas concisas en párrafos completos</li>
          <li>Añadir ejemplos y detalles a conceptos básicos</li>
          <li>Convertir notas breves en textos elaborados</li>
          <li>Ampliar la explicación de conceptos complejos</li>
        </ul>
      </section>

      <BaseForm 
        type="extender-texto"
      >
        <div className="os-form-field">
          <label htmlFor="originalText">Texto Original:</label>
          <textarea
            id="originalText"
            name="originalText"
            rows="6"
            placeholder="Introduce el texto que deseas expandir..."
            required
          />
        </div>

        <div className="os-form-field">
          <label htmlFor="targetLength">Longitud Objetivo (aproximada):</label>
          <select id="targetLength" name="targetLength" required>
            <option value="doble">Duplicar longitud</option>
            <option value="triple">Triplicar longitud</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="focus">Enfoque de la expansión:</label>
          <select id="focus" name="focus" required>
            <option value="detail">Añadir más detalles</option>
            <option value="examples">Incluir ejemplos</option>
            <option value="context">Expandir contexto</option>
            <option value="technical">Profundizar técnicamente</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="notes">Notas adicionales (opcional):</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Especifica cualquier requisito adicional para la expansión..."
          />
        </div>

        <button type="submit" className="os-form-submit">
          Expandir Texto
        </button>
      </BaseForm>
    </div>
  );
}

import React from "react";
import BaseForm from "./BaseForm";

export default function SchematizeTextForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Esquematizar Texto</h2>
        <p>
          Esta herramienta convierte tu texto en un esquema estructurado y
          organizado. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Organizar ideas de forma jerárquica</li>
          <li>Crear índices y esquemas de contenido</li>
          <li>Estructurar documentos complejos</li>
          <li>Visualizar la organización de un texto</li>
        </ul>
      </section>

      <BaseForm type="esquematizar-texto">
        <div className="os-form-field">
          <label htmlFor="originalText">Texto a Esquematizar:</label>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder="Introduce el texto que deseas convertir en esquema..."
            required
          />
        </div>

        <div className="os-form-field">
          <label htmlFor="schemeType">Tipo de Esquema:</label>
          <select id="schemeType" name="schemeType" required>
            <option value="numeric">Numérico (1, 1.1, 1.1.1)</option>
            <option value="alphabetic">Alfabético (A, A.1, A.1.1)</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="detailLevel">Nivel de Detalle:</label>
          <select id="detailLevel" name="detailLevel" required>
            <option value="high">Alto (muchos subniveles)</option>
            <option value="medium">Medio (balance)</option>
            <option value="low">Bajo (conceptos principales)</option>
          </select>
        </div>

        <div className="os-form-field">
          <label htmlFor="notes">Notas adicionales (opcional):</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Especifica cualquier requisito adicional para el esquema..."
          />
        </div>

        <button type="submit" className="os-form-submit">
          Esquematizar Texto
        </button>
      </BaseForm>
    </div>
  );
}
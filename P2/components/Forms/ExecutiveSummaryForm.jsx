import React from "react";
import BaseForm from "./BaseForm";

export default function ExecutiveSummaryForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Resumen Ejecutivo</h2>
        <p>
          Esta herramienta te ayuda a crear un resumen ejecutivo profesional y
          efectivo. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Presentar resultados de proyectos o investigaciones</li>
          <li>Sintetizar información compleja de manera clara</li>
          <li>Comunicar decisiones importantes a stakeholders</li>
          <li>Proponer nuevas iniciativas o cambios</li>
        </ul>
      </section>

      <BaseForm type="resumen-ejecutivo">
        {/* Datos Fundamentales */}
        <section className="os-form-section">
          <h3>Identificación del Documento</h3>

          <div className="os-form-field">
            <label htmlFor="title">Título:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Título principal del resumen ejecutivo"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="subtitle">Subtítulo (opcional):</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              placeholder="Subtítulo o descripción adicional"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="author">Autor:</label>
            <input
              type="text"
              id="author"
              name="author"
              required
              placeholder="Tu nombre o el del equipo responsable"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="date">Fecha:</label>
            <input
              type="date"
              id="date"
              name="date"
              required
            />
          </div>
        </section>

        {/* Introducción */}
        <section className="os-form-section">
          <h3>Introducción</h3>

          <div className="os-form-field">
            <label htmlFor="context">Contexto y antecedentes:</label>
            <textarea
              id="context"
              name="context"
              rows="4"
              required
              placeholder="Describe el contexto y los antecedentes relevantes del tema"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="objectives">Objetivos:</label>
            <textarea
              id="objectives"
              name="objectives"
              rows="4"
              required
              placeholder="Define los objetivos principales y específicos"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="importance">Importancia y relevancia:</label>
            <textarea
              id="importance"
              name="importance"
              rows="4"
              required
              placeholder="Explica por qué este tema es importante y relevante"
            />
          </div>
        </section>

        {/* Descripción del Proyecto */}
        <section className="os-form-section">
          <h3>Descripción del Proyecto</h3>

          <div className="os-form-field">
            <label htmlFor="methodology">Metodología utilizada:</label>
            <textarea
              id="methodology"
              name="methodology"
              rows="4"
              required
              placeholder="Describe la metodología o enfoque utilizado"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="scope">Alcance y limitaciones:</label>
            <textarea
              id="scope"
              name="scope"
              rows="4"
              required
              placeholder="Define el alcance del proyecto y sus limitaciones"
            />
          </div>
        </section>

        {/* Resultados */}
        <section className="os-form-section">
          <h3>Resultados</h3>

          <div className="os-form-field">
            <label htmlFor="keyData">Datos clave:</label>
            <textarea
              id="keyData"
              name="keyData"
              rows="4"
              required
              placeholder="Presenta los datos más relevantes y significativos"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="preliminaryConclusions">Conclusiones preliminares:</label>
            <textarea
              id="preliminaryConclusions"
              name="preliminaryConclusions"
              rows="4"
              required
              placeholder="Resume las conclusiones iniciales basadas en los datos"
            />
          </div>
        </section>

        {/* Conclusiones y Recomendaciones */}
        <section className="os-form-section">
          <h3>Conclusiones y Recomendaciones</h3>

          <div className="os-form-field">
            <label htmlFor="conclusions">Conclusiones finales:</label>
            <textarea
              id="conclusions"
              name="conclusions"
              rows="4"
              required
              placeholder="Presenta las conclusiones finales del proyecto"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommendations">Recomendaciones:</label>
            <textarea
              id="recommendations"
              name="recommendations"
              rows="4"
              required
              placeholder="Proporciona recomendaciones basadas en las conclusiones"
            />
          </div>
        </section>

        {/* Cierre */}
        <section className="os-form-section">
          <h3>Cierre</h3>

          <div className="os-form-field">
            <label htmlFor="summary">Resumen final:</label>
            <textarea
              id="summary"
              name="summary"
              rows="4"
              required
              placeholder="Resume los puntos más importantes del documento"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="nextSteps">Próximos pasos:</label>
            <textarea
              id="nextSteps"
              name="nextSteps"
              rows="4"
              placeholder="Describe los siguientes pasos a seguir (si aplica)"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="callToAction">Llamado a la acción:</label>
            <textarea
              id="callToAction"
              name="callToAction"
              rows="4"
              required
              placeholder="¿Qué acciones específicas se solicitan?"
            />
          </div>
        </section>

        <button type="submit" className="os-form-submit">
          Generar Resumen Ejecutivo
        </button>
      </BaseForm>
    </div>
  );
}
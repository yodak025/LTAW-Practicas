import React from "react";
import BaseForm from "./BaseForm";

export default function CoverLetterForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Carta de Presentación</h2>
        <p>
          Esta herramienta te ayuda a crear una carta de presentación profesional y
          convincente. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Postularte a una oferta de trabajo</li>
          <li>Destacar tus habilidades relevantes</li>
          <li>Demostrar tu motivación e interés</li>
          <li>Complementar tu currículum vitae</li>
        </ul>
      </section>

      <BaseForm type="carta-presentacion" submitText="Generar Carta">
        {/* Datos Fundamentales */}
        <section className="os-form-section">
          <h3>Datos Fundamentales</h3>

          <div className="os-form-field">
            <label htmlFor="fullName">Nombre completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              placeholder="Tu dirección"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Tu teléfono"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Tu email"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="professionalLinks">Enlaces profesionales:</label>
            <textarea
              id="professionalLinks"
              name="professionalLinks"
              rows="3"
              placeholder="LinkedIn, portfolio personal, etc."
            />
          </div>
        </section>

        {/* Datos del Destinatario */}
        <section className="os-form-section">
          <h3>Datos del Destinatario</h3>

          <div className="os-form-field">
            <label htmlFor="date">Fecha de envío:</label>
            <input
              type="date"
              id="date"
              name="date"
              required
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recruiterName">Nombre del reclutador:</label>
            <input
              type="text"
              id="recruiterName"
              name="recruiterName"
              placeholder="Nombre del reclutador o responsable"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="companyInfo">Empresa y departamento:</label>
            <input
              type="text"
              id="companyInfo"
              name="companyInfo"
              required
              placeholder="Nombre de la empresa y departamento"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="companyAddress">Dirección de la empresa:</label>
            <input
              type="text"
              id="companyAddress"
              name="companyAddress"
              required
              placeholder="Dirección de la empresa"
            />
          </div>
        </section>

        {/* Contenido de la Carta */}
        <section className="os-form-section">
          <h3>Contenido de la Carta</h3>

          <div className="os-form-field">
            <label htmlFor="position">Puesto al que aplicas:</label>
            <input
              type="text"
              id="position"
              name="position"
              required
              placeholder="Nombre del puesto"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="motivation">Motivación:</label>
            <textarea
              id="motivation"
              name="motivation"
              rows="4"
              required
              placeholder="¿Por qué te interesa este puesto y esta empresa?"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="relevantExperience">Experiencia y habilidades relevantes:</label>
            <textarea
              id="relevantExperience"
              name="relevantExperience"
              rows="6"
              required
              placeholder="Describe tu experiencia y habilidades más relevantes para el puesto"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="valueProposition">Valor para la empresa:</label>
            <textarea
              id="valueProposition"
              name="valueProposition"
              rows="4"
              required
              placeholder="¿Qué puedes aportar específicamente a la empresa?"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="additionalNotes">Notas adicionales:</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows="4"
              placeholder="Información adicional relevante"
            />
          </div>
        </section>
      </BaseForm>
    </div>
  );
}
import React from "react";
import BaseForm from "./BaseForm";

/**
 * Componente para crear un formulario de currículum vitae
 * @returns {JSX.Element} - Un elemento que representa el formulario 
 */

export default function CVForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Currículum Vitae</h2>
        <p>
          Esta herramienta te ayuda a crear un currículum vitae profesional y
          bien estructurado. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Presentar tu experiencia de manera efectiva</li>
          <li>Destacar tus habilidades y logros</li>
          <li>Crear un CV para diferentes sectores</li>
          <li>Actualizar tu perfil profesional</li>
        </ul>
      </section>

      <BaseForm type="curriculum-vitae" submitText="Generar CV">
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
              placeholder="Tus enlaces profesionales"
            />
          </div>
        </section>

        {/* Perfil */}
        <section className="os-form-section">
          <h3>Perfil</h3>

          <div className="os-form-field">
            <label htmlFor="briefPresentation">Presentación breve:</label>
            <textarea
              id="briefPresentation"
              name="briefPresentation"
              rows="4"
              required
              placeholder="Descripción de tu perfil profesional"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="strengthsAchievements">Fortalezas y logros:</label>
            <textarea
              id="strengthsAchievements"
              name="strengthsAchievements"
              rows="4"
              required
              placeholder="Tus fortalezas y logros principales"
            />
          </div>
        </section>

        {/* Experiencia Laboral */}
        <section className="os-form-section">
          <h3>Experiencia Laboral</h3>

          <div className="os-form-field">
            <label htmlFor="workExperience">Experiencias laborales:</label>
            <textarea
              id="workExperience"
              name="workExperience"
              rows="8"
              placeholder="Describe tu experiencia laboral"
            />
          </div>
        </section>

        {/* Formación Académica */}
        <section className="os-form-section">
          <h3>Formación Académica</h3>

          <div className="os-form-field">
            <label htmlFor="education">Formación:</label>
            <textarea
              id="education"
              name="education"
              rows="8"
              placeholder="Describe tu formación académica"
            />
          </div>
        </section>

        {/* Habilidades */}
        <section className="os-form-section">
          <h3>Habilidades</h3>

          <div className="os-form-field">
            <label htmlFor="technicalSkills">Habilidades Técnicas:</label>
            <textarea
              id="technicalSkills"
              name="technicalSkills"
              rows="4"
              required
              placeholder="Tus habilidades técnicas"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="softSkills">Habilidades Blandas:</label>
            <textarea
              id="softSkills"
              name="softSkills"
              rows="4"
              required
              placeholder="Tus habilidades blandas"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="languages">Idiomas:</label>
            <textarea
              id="languages"
              name="languages"
              rows="4"
              placeholder="Tus idiomas y niveles"
            />
          </div>
        </section>

        {/* Certificados */}
        <section className="os-form-section">
          <h3>Certificados</h3>

          <div className="os-form-field">
            <label htmlFor="certificates">Certificaciones:</label>
            <textarea
              id="certificates"
              name="certificates"
              rows="6"
              placeholder="Tus certificaciones"
            />
          </div>
        </section>

        {/* Proyectos y Logros */}
        <section className="os-form-section">
          <h3>Proyectos y Logros</h3>

          <div className="os-form-field">
            <label htmlFor="projectsAchievements">
              Proyectos destacados y logros:
            </label>
            <textarea
              id="projectsAchievements"
              name="projectsAchievements"
              rows="6"
              placeholder="Tus proyectos y logros destacados"
            />
          </div>
        </section>

        {/* Información Adicional */}
        <section className="os-form-section">
          <h3>Información Adicional</h3>

          <div className="os-form-field">
            <label htmlFor="additionalInfo">Información adicional para ayudar a crear tu CV:</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows="4"
              placeholder="No se incluirá en el CV."
            />
          </div>
        </section>
      </BaseForm>
    </div>
  );
}

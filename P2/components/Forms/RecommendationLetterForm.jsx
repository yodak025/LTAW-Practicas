import React from "react";
import BaseForm from "./BaseForm";

export default function RecommendationLetterForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Carta de Recomendación</h2>
        <p>
          Esta herramienta te ayuda a crear una carta de recomendación profesional y
          convincente. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Recomendar a un colaborador o estudiante</li>
          <li>Destacar las cualidades y logros de un candidato</li>
          <li>Apoyar una solicitud de empleo o admisión</li>
          <li>Validar la experiencia profesional de alguien</li>
        </ul>
      </section>

      <BaseForm type="carta-recomendacion">
        {/* Datos del Recomendante */}
        <section className="os-form-section">
          <h3>Datos del Recomendante</h3>

          <div className="os-form-field">
            <label htmlFor="recommenderName">Nombre completo:</label>
            <input
              type="text"
              id="recommenderName"
              name="recommenderName"
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommenderPosition">Cargo:</label>
            <input
              type="text"
              id="recommenderPosition"
              name="recommenderPosition"
              required
              placeholder="Tu cargo actual"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommenderCompany">Empresa:</label>
            <input
              type="text"
              id="recommenderCompany"
              name="recommenderCompany"
              required
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommenderAddress">Dirección:</label>
            <input
              type="text"
              id="recommenderAddress"
              name="recommenderAddress"
              required
              placeholder="Dirección de la empresa"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommenderEmail">Correo Electrónico:</label>
            <input
              type="email"
              id="recommenderEmail"
              name="recommenderEmail"
              required
              placeholder="Tu email profesional"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recommenderPhone">Teléfono:</label>
            <input
              type="tel"
              id="recommenderPhone"
              name="recommenderPhone"
              required
              placeholder="Tu teléfono de contacto"
            />
          </div>
        </section>

        {/* Datos del Destinatario (Opcional) */}
        <section className="os-form-section">
          <h3>Datos del Destinatario (Opcional)</h3>

          <div className="os-form-field">
            <label htmlFor="recipientName">Nombre completo:</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              placeholder="Nombre del destinatario"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientPosition">Cargo:</label>
            <input
              type="text"
              id="recipientPosition"
              name="recipientPosition"
              placeholder="Cargo del destinatario"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientCompany">Empresa o Institución:</label>
            <input
              type="text"
              id="recipientCompany"
              name="recipientCompany"
              placeholder="Nombre de la empresa o institución"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientAddress">Dirección:</label>
            <input
              type="text"
              id="recipientAddress"
              name="recipientAddress"
              placeholder="Dirección del destinatario"
            />
          </div>
        </section>

        {/* Datos del Candidato */}
        <section className="os-form-section">
          <h3>Información del Candidato</h3>

          <div className="os-form-field">
            <label htmlFor="candidateName">Nombre del candidato:</label>
            <input
              type="text"
              id="candidateName"
              name="candidateName"
              required
              placeholder="Nombre de la persona recomendada"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="relationship">Relación con el candidato:</label>
            <textarea
              id="relationship"
              name="relationship"
              rows="4"
              required
              placeholder="Describe tu relación profesional con el candidato"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="timeKnown">Tiempo de conocer al candidato:</label>
            <input
              type="text"
              id="timeKnown"
              name="timeKnown"
              required
              placeholder="Ej: 2 años y 6 meses"
            />
          </div>
        </section>

        {/* Cualidades y Experiencia */}
        <section className="os-form-section">
          <h3>Cualidades y Experiencia</h3>

          <div className="os-form-field">
            <label htmlFor="qualities">Cualidades y habilidades:</label>
            <textarea
              id="qualities"
              name="qualities"
              rows="6"
              required
              placeholder="Describe las cualidades y habilidades más destacadas del candidato"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="achievements">Logros y contribuciones:</label>
            <textarea
              id="achievements"
              name="achievements"
              rows="6"
              required
              placeholder="Describe los logros más significativos del candidato"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="personalEvaluation">Valoración personal:</label>
            <textarea
              id="personalEvaluation"
              name="personalEvaluation"
              rows="4"
              required
              placeholder="Tu evaluación personal del candidato"
            />
          </div>
        </section>

        {/* Información Adicional */}
        <section className="os-form-section">
          <h3>Información Adicional</h3>

          <div className="os-form-field">
            <label htmlFor="additionalInfo">Información adicional relevante:</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows="4"
              placeholder="Cualquier información adicional que quieras incluir"
            />
          </div>
        </section>

        <button type="submit" className="os-form-submit">
          Generar Carta
        </button>
      </BaseForm>
    </div>
  );
}
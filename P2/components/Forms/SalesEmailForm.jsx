import React from "react";
import BaseForm from "./BaseForm";

export default function SalesEmailForm() {
  return (
    <div className="os-form-container">
      <section className="os-form-explanation">
        <h2>Email de Ventas</h2>
        <p>
          Esta herramienta te ayuda a crear emails de venta persuasivos y
          efectivos. Es útil cuando necesitas:
        </p>
        <ul>
          <li>Contactar potenciales clientes de forma profesional</li>
          <li>Presentar productos o servicios de manera atractiva</li>
          <li>Generar interés y conseguir respuestas</li>
          <li>Convertir prospectos en clientes</li>
        </ul>
      </section>

      <BaseForm type="email-ventas" submitText="Generar Email">
        {/* Título y Destinatario */}
        <section className="os-form-section">
          <h3>Título y Destinatario</h3>

          <div className="os-form-field">
            <label htmlFor="emailTitle">Título del email:</label>
            <input
              type="text"
              id="emailTitle"
              name="emailTitle"
              required
              placeholder="Título atractivo que incluya el beneficio principal"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientName">Nombre del destinatario:</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              required
              placeholder="Nombre de la persona a quien va dirigido"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientPosition">Cargo del destinatario:</label>
            <input
              type="text"
              id="recipientPosition"
              name="recipientPosition"
              required
              placeholder="Cargo o posición en la empresa"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="recipientCompany">Empresa del destinatario:</label>
            <input
              type="text"
              id="recipientCompany"
              name="recipientCompany"
              required
              placeholder="Nombre de la empresa del destinatario"
            />
          </div>
        </section>

        {/* Datos del Remitente */}
        <section className="os-form-section">
          <h3>Datos del Remitente</h3>

          <div className="os-form-field">
            <label htmlFor="senderName">Tu nombre completo:</label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              required
              placeholder="Tu nombre y apellidos"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="senderPosition">Tu cargo:</label>
            <input
              type="text"
              id="senderPosition"
              name="senderPosition"
              required
              placeholder="Tu cargo en la empresa"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="senderCompany">Tu empresa:</label>
            <input
              type="text"
              id="senderCompany"
              name="senderCompany"
              required
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="contactInfo">Datos de contacto:</label>
            <textarea
              id="contactInfo"
              name="contactInfo"
              rows="3"
              required
              placeholder="Incluye teléfono, email y otros medios de contacto relevantes"
            />
          </div>
        </section>

        {/* Contenido del Email */}
        <section className="os-form-section">
          <h3>Contenido del Email</h3>

          <div className="os-form-field">
            <label htmlFor="contactReason">Motivo del contacto:</label>
            <textarea
              id="contactReason"
              name="contactReason"
              rows="4"
              required
              placeholder="Explica por qué te diriges específicamente a este destinatario"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="clientNeed">Necesidad identificada:</label>
            <textarea
              id="clientNeed"
              name="clientNeed"
              rows="4"
              required
              placeholder="Describe la necesidad o problema que has identificado"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="proposedSolution">Solución propuesta:</label>
            <textarea
              id="proposedSolution"
              name="proposedSolution"
              rows="4"
              required
              placeholder="Explica cómo tu producto/servicio resuelve la necesidad"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="differentiators">Factores diferenciadores:</label>
            <textarea
              id="differentiators"
              name="differentiators"
              rows="4"
              required
              placeholder="¿Qué hace única tu propuesta frente a la competencia?"
            />
          </div>

          <div className="os-form-field">
            <label htmlFor="callToAction">Llamado a la acción:</label>
            <textarea
              id="callToAction"
              name="callToAction"
              rows="4"
              required
              placeholder="¿Qué acción específica quieres que tome el destinatario?"
            />
          </div>
        </section>
      </BaseForm>
    </div>
  );
}
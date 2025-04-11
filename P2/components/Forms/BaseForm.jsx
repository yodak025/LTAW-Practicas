import React from "react";

/**
 * Componente base para manejar la funcionalidad común de formularios
 * @param {Object} props
 * @param {string} props.type - Tipo de formulario
 * @param {React.ReactNode} props.children - Elementos del formulario
 */
export default function BaseForm({ type, children }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Recoger los datos del formulario
    const formData = {};
    const formElements = event.target.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name) {
        formData[element.name] = element.value;
      }
    }

    // Enviar la petición
    const m = new XMLHttpRequest();
    m.onreadystatechange = () => {
      if (m.readyState === 4) {
        console.log("Peticion completada");
        console.log("status: " + m.status);

        if (m.status === 200) {
          const resourceId = m.responseText;
          window.location.href = `/document.html?resource-id=${resourceId}`;
        }
      }
    };

    m.open("POST", `/generate-document?type=${type}`, true);
    m.setRequestHeader("Content-Type", "application/json");
    m.send(JSON.stringify(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="os-form">
      {children}
    </form>
  );
}

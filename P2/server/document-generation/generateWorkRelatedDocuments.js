import { callLMStudioAPI, requestTemplate } from "./documentGenerationUtils";
//------------------------Curriculum Vitae------------------------

/**
 * Genera un currículum vitae completo a partir de la información proporcionada por el usuario.
 *
 * @param {Object} data - Datos del candidato para generar el CV
 * @param {string} data.fullName - Nombre completo del candidato
 * @param {string} data.address - Dirección del candidato
 * @param {string} data.phone - Número de teléfono del candidato
 * @param {string} data.email - Correo electrónico del candidato
 * @param {string} data.briefPresentation - Presentación breve del candidato
 * @param {string} data.strengthsAchievements - Fortalezas y logros profesionales
 * @param {string} [data.workExperience] - Experiencia laboral del candidato
 * @param {string} [data.education] - Formación académica del candidato
 * @param {string} data.technicalSkills - Habilidades técnicas del candidato
 * @param {string} data.softSkills - Habilidades blandas del candidato
 * @param {string} [data.languages] - Idiomas que domina el candidato
 * @param {string} [data.certificates] - Certificaciones del candidato
 * @param {string} [data.projectsAchievements] - Proyectos y logros del candidato
 * @param {string} [data.additionalInfo] - Información adicional a considerar
 * @param {string} [data.proffesionalLinks] - Enlaces profesionales del candidato
 * @returns {Object} Objeto estructurado con el contenido del currículum vitae
 */
export const generateCV = async (data) => {
  const profileRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presentan entre comillas dos textos que contienen información sobre el perfil profesional de un candidato. El primero se trata de una presentación.
        "${data.briefPresentation}".
        El segundo, describe sus logros y fortalezas profesionales.
        "${data.strengthsAchievements}".
        Debes generar el contenido de la sección "Perfil Profesional" del currículum vitae, integrando ambos textos y evitando repetir información. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos. 
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""}
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };
  const experienceRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta entre comillas un texto que contiene información sobre la experiencia profesional del candidato:
        "${data.workExperience}".
        Debes generar el contenido de la sección "Experiencia Laboral" del currículum vitae. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos.
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""} 
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };

  const educationRequest = {  
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta entre comillas un texto que contiene información sobre la formación académica del candidato:
        "${data.education}".
        Debes generar el contenido de la sección "Formación Académica" del currículum vitae. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos. 
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""}
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };
  const skillsRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presentan entre comillas varios textos que contienen información sobre las habilidades del candidato. 
        El primero expone sus habilidades técnicas:
        "${data.technicalSkills}".
        El segundo, expone sus habilidades blandas:
        "${data.softSkills}".
        ${data.languages ? `El tercero, expone los idiomas que habla: "${data.languages}".` : ""}
        Debes generar el contenido de la sección "Habilidades" del currículum vitae, integrando estos textos y evitando repetir información. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos. 
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""}
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };
  const certificationsRequest = {  
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta entre comillas un texto que contiene información sobre los certificados que posee el candidato:
        "${data.certificates}".
        Debes generar el contenido de la sección "Certificados" del currículum vitae. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos. 
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""}
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };
  const projectsRequest = {  
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar Currículums Vitae de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta entre comillas un texto que contiene información sobre los proyectos y logros que ha realizado el candidato:
        "${data.projectsAchievements}".
        Debes generar el contenido de la sección "Proyectos y Logros" del currículum vitae. 
        Estructura la información de la manera más clara y vistosa posible, limitandote a generar texto plano en forma de párrafos. 
        ${data.additionalInfo ? `Ten en cuenta las siguientes especificaciones adicionales: "${data.additionalInfo}".` : ""}
        No puedes incluir títulos ni encabezados en el texto final. Evita incluir comentarios en tu respuesta. Evita incluir etiquetas o formato de ningún tipo.`,
  };

  const previousConversation = []
  const profileResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([profileRequest]))
  );
  previousConversation.push(profileRequest, {role: "assistant" , content: profileResponse});

  const experienceResponse = data.workExperience
    ? JSON.stringify(
        await callLMStudioAPI(requestTemplate([...previousConversation].concat(educationRequest)))
      )
    : null;
  if (experienceResponse) previousConversation.push(experienceRequest,{role: "assistant" , content: experienceResponse} );
  
  const educationResponse = data.education
    ? JSON.stringify(
        await callLMStudioAPI(requestTemplate([...previousConversation].concat(educationRequest)))
      )
    : null;
  if (educationResponse) previousConversation.push(educationRequest,{role: "assistant" , content: educationResponse} );

  const skillsResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([...previousConversation].concat(skillsRequest)))
  );
  previousConversation.push(skillsRequest,{role: "assistant" , content: skillsResponse} );
  const certificationsResponse = data.certificates
    ? JSON.stringify(
        await callLMStudioAPI(requestTemplate([...previousConversation].concat(certificationsRequest)))
      )
    : null;
  if (certificationsResponse) previousConversation.push(certificationsRequest,{role: "assistant" , content: certificationsResponse} );
  const projectsResponse = data.projectsAchievements
    ? JSON.stringify(
        await callLMStudioAPI(requestTemplate([...previousConversation].concat(projectsRequest)))
      )
    : null;



  let response = {
    "Currículum Vitae": {
      "Datos de Contacto": {
        "Nombre Completo": data.fullName,
        Dirección: data.address,
        Teléfono: data.phone,
        "Correo Electrónico": data.email,
      },
    },
  };
  if (data.proffesionalLinks)
    response["Currículum Vitae"]["Datos de Contacto"]["Enlaces Profesionales"] =
      data.proffesionalLinks;
  response["Currículum Vitae"]["Perfil"] = profileResponse;
  if (data.workExperience)
    response["Currículum Vitae"]["Experiencia Laboral"] = experienceResponse;
  if (data.education)
    response["Currículum Vitae"]["Formación Académica"] = educationResponse;
  response["Currículum Vitae"]["Habilidades"] = skillsResponse;
  if (data.certifications)
    response["Currículum Vitae"]["Certificados"] = certificationsResponse;
  if (data.projects)
    response["Currículum Vitae"]["Proyectos y Logros"] = projectsResponse;
  return response;
};

//------------------------Carta de Presentación------------------------
/**
 * Genera una carta de presentación profesional para una candidatura laboral.
 *
 * @param {Object} data - Datos para generar la carta de presentación
 * @param {string} data.fullName - Nombre completo del candidato
 * @param {string} data.position - Puesto al que se aplica
 * @param {string} data.companyInfo - Nombre de la empresa y departamento
 * @param {string} data.date - Fecha de envío en formato compatible con Date()
 * @param {string} data.motivation - Motivación del candidato para aplicar
 * @param {string} data.relevantExperience - Experiencia y habilidades relevantes
 * @param {string} data.valueProposition - Valor que puede aportar a la empresa
 * @param {string} data.phone - Número de teléfono del candidato
 * @param {string} data.email - Correo electrónico del candidato
 * @param {string} data.address - Dirección del candidato
 * @param {string} [data.recruiterName] - Nombre del reclutador, si se conoce
 * @param {string} [data.additionalNotes] - Notas adicionales a considerar
 * @param {string} [data.professionalLinks] - Enlaces profesionales del candidato
 * @returns {Object} Objeto con el asunto y cuerpo de la carta de presentación
 */
export const generateCoverLetter = async (data) => {
  // Formatear la fecha
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const presentationRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar cartas de presentación profesionales.
        Tu tarea es generar el cuerpo de una carta de presentación empresarial en formato texto plano.

        CONTEXTO DE LA APLICACIÓN:
        - Puesto al que se aplica: "${data.position}"
        - Empresa y departamento: "${data.companyInfo}"
        - ${data.recruiterName ? `El reclutador es ${data.recruiterName}` : 'Se desconoce el nombre del reclutador'}
        - Fecha de envío: ${formattedDate}

        CONTENIDO PROPORCIONADO POR EL CANDIDATO:
        Motivación del candidato:
        "${data.motivation}"

        Experiencia y habilidades relevantes:
        "${data.relevantExperience}"

        Valor que puede aportar a la empresa:
        "${data.valueProposition}"
        ${data.additionalNotes ? `\nNotas adicionales a considerar:\n"${data.additionalNotes}"` : ""}

        INSTRUCCIONES:
        1. Genera una carta de presentación profesional que integre toda la información proporcionada.
        2. La carta debe mantener un tono formal y profesional.
        3. Si conoces el nombre del reclutador, personaliza el saludo.
        4. Estructura el contenido en párrafos claros y concisos.
        5. Al final del texto, incluye una sección de firma con los datos de contacto en un formato profesional.

        DATOS DE CONTACTO A INCLUIR AL FINAL:
        ${data.fullName}
        ${data.phone}
        ${data.email}
        ${data.address}
        ${data.professionalLinks ? data.professionalLinks : ""}

        Es fundamental que devuelvas SOLO el texto plano de la carta. No incluyas comentarios, títulos ni formato adicional.`,
  };

  const bodyResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([presentationRequest]))
  );

  return {
    "Carta de Presentación": {
      "Asunto": `Candidatura: ${data.position} - ${data.fullName}`,
      "Cuerpo": bodyResponse
    }
  };
};

//------------------------Resumen Ejecutivo------------------------
/**
 * Genera un resumen ejecutivo profesional estructurado en secciones coherentes.
 *
 * @param {Object} data - Datos para generar el resumen ejecutivo
 * @param {string} data.title - Título del resumen ejecutivo
 * @param {string} data.author - Autor del resumen ejecutivo
 * @param {string} data.date - Fecha del documento en formato compatible con Date()
 * @param {string} data.context - Contexto y antecedentes del proyecto
 * @param {string} data.objectives - Objetivos del proyecto
 * @param {string} data.importance - Importancia y relevancia del proyecto
 * @param {string} data.methodology - Metodología utilizada en el proyecto
 * @param {string} data.scope - Alcance y limitaciones del proyecto
 * @param {string} data.keyData - Datos clave del proyecto
 * @param {string} data.preliminaryConclusions - Conclusiones preliminares
 * @param {string} data.conclusions - Conclusiones finales
 * @param {string} data.recommendations - Recomendaciones
 * @param {string} data.summary - Resumen final
 * @param {string} [data.subtitle] - Subtítulo del resumen ejecutivo
 * @param {string} [data.nextSteps] - Próximos pasos a seguir
 * @returns {Object} Objeto estructurado con las secciones del resumen ejecutivo
 */
export const generateExecutiveSummary = async (data) => {
  // Formatear la fecha
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Generar la introducción
  const introductionRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar resúmenes ejecutivos profesionales.
        Tu tarea es generar el contenido de la sección de introducción de un resumen ejecutivo.

        CONTEXTO DEL DOCUMENTO:
        Título: "${data.title}"
        ${data.subtitle ? `Subtítulo: "${data.subtitle}"` : ''}
        Autor: ${data.author}
        Fecha: ${formattedDate}

        CONTENIDO A PROCESAR:
        Contexto y antecedentes:
        "${data.context}"

        Objetivos:
        "${data.objectives}"

        Importancia y relevancia:
        "${data.importance}"

        INSTRUCCIONES:
        1. Genera una introducción cohesiva que integre el contexto, los objetivos y la importancia.
        2. Mantén un tono profesional y ejecutivo.
        3. La introducción debe ser concisa pero completa.
        4. No incluyas títulos ni subtítulos.
        5. Evita repetir información innecesariamente.
        6. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Generar descripción del proyecto
  const projectDescriptionRequest = {
    role: "user",
    content: `Continuando con el resumen ejecutivo, genera la descripción del proyecto.

        CONTENIDO A PROCESAR:
        Metodología utilizada:
        "${data.methodology}"

        Alcance y limitaciones:
        "${data.scope}"

        INSTRUCCIONES:
        1. Integra la metodología y el alcance en una descripción fluida.
        2. Mantén la consistencia con la introducción previa.
        3. Enfócate en los aspectos más relevantes para la toma de decisiones.
        4. No incluyas títulos ni subtítulos.
        5. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Generar resultados y conclusiones
  const resultsRequest = {
    role: "user",
    content: `Continuando con el resumen ejecutivo, genera la sección de resultados y conclusiones.

        CONTENIDO A PROCESAR:
        Datos clave:
        "${data.keyData}"

        Conclusiones preliminares:
        "${data.preliminaryConclusions}"

        Conclusiones finales:
        "${data.conclusions}"

        Recomendaciones:
        "${data.recommendations}"

        INSTRUCCIONES:
        1. Presenta los resultados de manera clara y concisa.
        2. Integra las conclusiones preliminares y finales de forma coherente.
        3. Relaciona las recomendaciones con los hallazgos.
        4. No incluyas títulos ni subtítulos.
        5. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Generar cierre
  const closingRequest = {
    role: "user",
    content: `Finalizando el resumen ejecutivo, genera la sección de cierre.

        CONTENIDO A PROCESAR:
        Resumen final:
        "${data.summary}"

        ${data.nextSteps ? `Próximos pasos:\n"${data.nextSteps}"` : ''}

        Llamado a la acción:
        "${data.callToAction}"

        INSTRUCCIONES:
        1. Integra el resumen final con un llamado a la acción claro.
        2. ${data.nextSteps ? 'Incluye los próximos pasos de manera natural.' : 'Enfócate en el resumen y el llamado a la acción.'}
        3. El cierre debe ser contundente y motivador.
        4. No incluyas títulos ni subtítulos.
        5. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Realizar las llamadas a la API en secuencia para mantener coherencia
  const introResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([introductionRequest]))
  );

  const descriptionResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([introductionRequest, 
      { role: "assistant", content: introResponse },
      projectDescriptionRequest]))
  );

  const resultsResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([introductionRequest,
      { role: "assistant", content: introResponse },
      projectDescriptionRequest,
      { role: "assistant", content: descriptionResponse },
      resultsRequest]))
  );

  const closingResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([introductionRequest,
      { role: "assistant", content: introResponse },
      projectDescriptionRequest,
      { role: "assistant", content: descriptionResponse },
      resultsRequest,
      { role: "assistant", content: resultsResponse },
      closingRequest]))
  );

  return {
    "Resumen Ejecutivo": {
      "Título": data.title,
      ...(data.subtitle && { "Subtítulo": data.subtitle }),
      "Fecha": formattedDate,
      "Autor": data.author,
      "Contenido": {
        "Introducción": introResponse,
        "Descripción del Proyecto": descriptionResponse,
        "Resultados y Conclusiones": resultsResponse,
        "Cierre": closingResponse
      }
    }
  };
};

//------------------------Descripción de Producto------------------------
/**
 * Genera una descripción de producto completa y persuasiva para uso comercial.
 *
 * @param {Object} data - Datos para generar la descripción del producto
 * @param {string} data.productName - Nombre del producto
 * @param {string} data.keywordDescription - Descripción con palabras clave del producto
 * @param {string} data.features - Características principales del producto
 * @param {string} data.benefits - Beneficios para el usuario
 * @param {string} data.reviews - Opiniones de clientes sobre el producto
 * @param {string} data.callToAction - Llamado a la acción para el cierre
 * @param {string} [data.subtitle] - Subtítulo o eslogan del producto
 * @param {string} [data.technicalDetails] - Detalles técnicos del producto
 * @param {string} [data.certifications] - Certificaciones y garantías del producto
 * @returns {Object} Objeto estructurado con las secciones de la descripción del producto
 */
export const generateProductDescription = async (data) => {
  // Generar la introducción y características principales
  const mainContentRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar descripciones de productos profesionales.
        Tu tarea es generar el contenido de la introducción y características principales de una descripción de producto.

        INFORMACIÓN DEL PRODUCTO:
        Nombre: "${data.productName}"
        ${data.subtitle ? `Subtítulo: "${data.subtitle}"` : ''}

        CONTENIDO A PROCESAR:
        Descripción con palabras clave:
        "${data.keywordDescription}"

        Características principales:
        "${data.features}"

        Beneficios para el usuario:
        "${data.benefits}"

        INSTRUCCIONES:
        1. Genera una introducción atractiva que capture la atención.
        2. Integra las palabras clave de manera natural.
        3. Presenta las características y beneficios de forma persuasiva.
        4. Mantén un tono profesional pero cercano.
        5. No incluyas títulos ni subtítulos en el texto.
        6. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Generar especificaciones técnicas si existen
  const technicalRequest = data.technicalDetails || data.certifications ? {
    role: "user",
    content: `Continuando con la descripción del producto, genera la sección técnica.

        CONTENIDO A PROCESAR:
        ${data.technicalDetails ? `Detalles técnicos:\n"${data.technicalDetails}"` : ''}
        ${data.certifications ? `\nCertificaciones y garantías:\n"${data.certifications}"` : ''}

        INSTRUCCIONES:
        1. Presenta la información técnica de manera clara y precisa.
        2. Destaca las certificaciones y garantías relevantes.
        3. Mantén la coherencia con el contenido anterior.
        4. No incluyas títulos ni subtítulos.
        5. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  } : null;

  // Generar sección de opiniones y cierre
  const closingRequest = {
    role: "user",
    content: `Finalizando la descripción del producto, genera la sección de opiniones y cierre.

        CONTENIDO A PROCESAR:
        Opiniones de clientes:
        "${data.reviews}"

        Llamado a la acción:
        "${data.callToAction}"

        INSTRUCCIONES:
        1. Integra los testimonios de manera convincente.
        2. Concluye con un llamado a la acción persuasivo.
        3. Mantén la coherencia con el contenido anterior.
        4. No incluyas títulos ni subtítulos.
        5. Evita dar formato a la respuesta, devuelve solo texto plano, sin etiquetas ni comentarios.`,
  };

  // Realizar las llamadas a la API en secuencia para mantener coherencia
  const mainResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([mainContentRequest]))
  );

  let technicalResponse = null;
  if (technicalRequest) {
    technicalResponse = JSON.stringify(
      await callLMStudioAPI(requestTemplate([mainContentRequest,
        { role: "assistant", content: mainResponse },
        technicalRequest]))
    );
  }

  const closingResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([mainContentRequest,
      { role: "assistant", content: mainResponse },
      ...(technicalRequest ? [
        technicalRequest,
        { role: "assistant", content: technicalResponse }
      ] : []),
      closingRequest]))
  );

  return {
    "Descripción de Producto": {
      "Título": data.productName,
      ...(data.subtitle && { "Subtítulo": data.subtitle }),
      "Contenido": {
        "Introducción y Características": mainResponse,
        ...(technicalResponse && { "Especificaciones Técnicas": technicalResponse }),
        "Opiniones y Cierre": closingResponse
      }
    }
  };
};

//------------------------Email de Ventas------------------------
/**
 * Genera un email de ventas persuasivo para contactar potenciales clientes.
 *
 * @param {Object} data - Datos para generar el email de ventas
 * @param {string} data.emailTitle - Título o asunto del email
 * @param {string} data.recipientName - Nombre del destinatario
 * @param {string} data.recipientPosition - Cargo del destinatario
 * @param {string} data.recipientCompany - Empresa del destinatario
 * @param {string} data.senderName - Nombre del remitente
 * @param {string} data.senderPosition - Cargo del remitente
 * @param {string} data.senderCompany - Empresa del remitente
 * @param {string} data.contactReason - Motivo del contacto
 * @param {string} data.clientNeed - Necesidad identificada en el cliente
 * @param {string} data.proposedSolution - Solución propuesta al cliente
 * @param {string} data.differentiators - Factores diferenciadores de la propuesta
 * @param {string} data.callToAction - Llamado a la acción para el cierre
 * @param {string} data.contactInfo - Datos de contacto del remitente
 * @returns {Object} Objeto con el título y contenido del email de ventas
 */
export const generateSalesEmail = async (data) => {
  // Generar el contenido del email
  const emailRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar emails de venta efectivos.
        Tu tarea es generar un email de ventas persuasivo y profesional en texto plano.

        INFORMACIÓN DEL EMAIL:
        Título: "${data.emailTitle}"
        
        DESTINATARIO:
        Nombre: ${data.recipientName}
        Cargo: ${data.recipientPosition}
        Empresa: ${data.recipientCompany}

        REMITENTE:
        Nombre: ${data.senderName}
        Cargo: ${data.senderPosition}
        Empresa: ${data.senderCompany}

        CONTENIDO PROPORCIONADO:
        Motivo del contacto:
        "${data.contactReason}"

        Necesidad identificada:
        "${data.clientNeed}"

        Solución propuesta:
        "${data.proposedSolution}"

        Factores diferenciadores:
        "${data.differentiators}"

        Llamado a la acción:
        "${data.callToAction}"

        INSTRUCCIONES:
        1. Genera un email de ventas profesional que integre toda la información proporcionada.
        2. El email debe mantener un tono profesional pero cercano.
        3. Estructura el contenido de manera clara y persuasiva.
        4. Al final, incluye los datos de contacto proporcionados.
        5. El email debe estar en texto plano, sin formato ni etiquetas.
        6. No incluyas comentarios ni instrucciones en el texto generado.

        DATOS DE CONTACTO A INCLUIR AL FINAL:
        ${data.contactInfo}`,
  };

  const emailResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([emailRequest]))
  );

  return {
    "Email de Ventas": {
      "Título": data.emailTitle,
      "Contenido": emailResponse
    }
  };
};

//------------------------Carta de Recomendación------------------------
/**
 * Genera una carta de recomendación profesional para un candidato.
 *
 * @param {Object} data - Datos para generar la carta de recomendación
 * @param {string} data.recommenderName - Nombre del recomendante
 * @param {string} data.recommenderPosition - Cargo del recomendante
 * @param {string} data.recommenderCompany - Empresa del recomendante
 * @param {string} data.recommenderAddress - Dirección del recomendante
 * @param {string} data.recommenderEmail - Email del recomendante
 * @param {string} data.recommenderPhone - Teléfono del recomendante
 * @param {string} data.candidateName - Nombre del candidato recomendado
 * @param {string} data.relationship - Relación con el candidato
 * @param {string} data.timeKnown - Tiempo de conocer al candidato
 * @param {string} data.qualities - Cualidades y habilidades del candidato
 * @param {string} data.achievements - Logros y contribuciones del candidato
 * @param {string} data.personalEvaluation - Valoración personal del candidato
 * @param {string} [data.recipientName] - Nombre del destinatario
 * @param {string} [data.recipientPosition] - Cargo del destinatario
 * @param {string} [data.recipientCompany] - Empresa/Institución del destinatario
 * @param {string} [data.recipientAddress] - Dirección del destinatario
 * @param {string} [data.additionalInfo] - Información adicional relevante
 * @returns {Object} Objeto con el asunto y contenido de la carta de recomendación
 */
export const generateRecommendationLetter = async (data) => {
  const letterRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar cartas de recomendación profesionales.
        Tu tarea es generar una carta de recomendación en texto plano, sin formato ni etiquetas.

        DATOS DEL RECOMENDANTE:
        Nombre: ${data.recommenderName}
        Cargo: ${data.recommenderPosition}
        Empresa: ${data.recommenderCompany}
        Dirección: ${data.recommenderAddress}
        Email: ${data.recommenderEmail}
        Teléfono: ${data.recommenderPhone}

        ${data.recipientName ? `DATOS DEL DESTINATARIO:
        Nombre: ${data.recipientName}
        ${data.recipientPosition ? `Cargo: ${data.recipientPosition}` : ''}
        ${data.recipientCompany ? `Empresa/Institución: ${data.recipientCompany}` : ''}
        ${data.recipientAddress ? `Dirección: ${data.recipientAddress}` : ''}` : ''}

        DATOS DEL CANDIDATO:
        Nombre: ${data.candidateName}
        Relación con el candidato: "${data.relationship}"
        Tiempo de conocer al candidato: ${data.timeKnown}

        CUALIDADES Y EXPERIENCIA:
        Cualidades y habilidades:
        "${data.qualities}"

        Logros y contribuciones:
        "${data.achievements}"

        Valoración personal:
        "${data.personalEvaluation}"

        ${data.additionalInfo ? `Información adicional:
        "${data.additionalInfo}"` : ''}

        INSTRUCCIONES:
        1. Genera una carta de recomendación profesional que integre toda la información proporcionada.
        2. La carta debe mantener un tono formal y profesional.
        3. Estructura el contenido de manera clara y convincente.
        4. Incluye todos los datos del recomendante al final de la carta.
        5. La carta debe estar en texto plano, sin formato ni etiquetas.
        6. No incluyas comentarios ni instrucciones en el texto generado.
        7. No uses placeholders ni texto entre corchetes.
        8. Si no hay destinatario específico, usa una referencia genérica. Por ejemplo "A quien corresponda".`,
  };

  const letterResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([letterRequest]))
  );

  return {
    "Carta de Recomendación": {
      "Asunto": `Carta de Recomendación: ${data.candidateName}`,
      "Contenido": letterResponse
    }
  };
};

import { callLMStudioAPI, requestTemplate } from "./documentGenerationUtils";
//------------------------Curriculum Vitae------------------------

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
        5. Evita repetir información innecesariamente.`,
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
        4. No incluyas títulos ni subtítulos.`,
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
        4. No incluyas títulos ni subtítulos.`,
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
        4. No incluyas títulos ni subtítulos.`,
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

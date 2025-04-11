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

const generatePresentationLetter = (data) => {
  return {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Genera una carta de presentación profesional para buscar trabajo. 
      La carta debe tener un tono formal y personalizado, y estar estructurada según el siguiente esquema:\n\n

      Encabezado\n
      Saludo\n
      Introducción\n
      Cuerpo\n
      Cierre\n
      Despedida\n
      Firma\n\n 

      1. El encabezado debe contener la siguiente información: 
      nombre completo "${data.nombre}": , 
      dirección: "${data.direccion}",
       número de teléfono "${data.telefono}"
       y dirección de correo electrónico  "${data.email}".\n
      2. El saludo debe ser personalizado y dirigido a la persona encargada de la contratación, mencionando su nombre "${data.destinatario}", así como a la empresa "${data.empresa}". 
      Además, debe utilizar una formula de cortesía adecuada.\n
      3. La introducción debe incluir una breve presentación personal y una mención del puesto al que se está postulando, que es "${data.cargo}". \n 
      Para la introducción, intenta basarte en el siguiente texto, si es adecuado: "${data.introduccion}". Si no fuese adecuado adecúalo modificando todo lo que sea necesario.\n
      4. El cuerpo de la carta debe contener una descripción de las habilidades "${data.habilidades}" y experiencia "${data.experiencia}" del candidato. 
      También debe mencionar los motivos por los que se postula al puesto y por qué considera que es el candidato ideal para el mismo: "${data.motivacion}".\n
      5. El cierre debe crearse a partir de la siguiente frase: "${data.cierre}", modificandola si es necesario.\n 

      Utiliza esta estructura y asegúrate de que la respuesta mantenga la coherencia y el formato indicado.
      Entrega un resultado final que no contenga placeholders y que sea adecuado en forma, como texto plano legible y sin etiquetas de ningún tipo.
      Evita incluir comentarios en tu respuesta. Entrega solo el contenido de la carta de presentación. Genera los saltos de línea necesarios para que el texto sea legible. 
      Asegurate de entregar una carta de presentación en castellano. Integra las secciones y no incluyas los títulos de las mismas entre **[]** en la respuesta final.`,
      },
    ],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS, // -1 o ajusta según la cantidad deseada
    stream: IS_STREAM, // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
    top_p: 1,
    repetition_penalty: 1,
  };
};

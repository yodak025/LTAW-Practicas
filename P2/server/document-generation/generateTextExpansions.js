import {
  callLMStudioAPI,
  requestTemplate,
} from "./documentGenerationUtils";

export const generateExpandedText = async (data) => {
  let typeSentence = "";
  switch (data.focus) {
    case "detail":
      typeSentence = "añadir más detalles al";
      break;
    case "examples":
      typeSentence = "ilustrar con ejemplos de";
      break;
    case "context":
      typeSentence = "expandir el contexto del";
      break;
    case "technical":
      typeSentence = "profundizar en los aspéctos técnicos del";
      break;
  }

  const requestData = requestTemplate([
    {
      role: "user",
      content: `Eres parte de una aplicación web que ayuda a los usuarios a generar textos de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta un texto entre comillas que contiene una serie de ideas y conceptos. 
        "${data.originalText}"
        Actúa como un experto en redacción y amplía el texto, desarrollando cada idea y concepto de manera clara y detallada.
        La extensión aproximada del texto resultante debe ser aproximadamente de el ${
          data.targetLength
        } de la extensión original.
        Concretamente, debes enfocarte en ${typeSentence} texto original. 
        ${
          data.notes
            ? "Además, ten en cuenta las siguientes consideraciones:\n\n" +
              data.notes
            : ""
        }
        \n
        Es fundamental que devuelvas el texto generado en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita incluir títulos o encabezados en el texto final.  Evita dar formato al texto con markdown, HTML o cualquier otro tipo de sistema formato.`,
    },
  ]);
  const expandedText = JSON.stringify(await callLMStudioAPI(requestData));
  return { "Texto Expandido": expandedText };
};

//------------------------------------ Sumarize Text ------------------------------------//
export const generateSumarizedText = async (data) => {
  let extensionSentence = "";
  switch (data.summaryLength) {
    case "very-short":
      extensionSentence = "25%";
      break;
    case "short":
      extensionSentence = "50%";
      break;
    case "medium":
      extensionSentence = "75%";
      break;
  }

  let typeSentence = "";
  switch (data.focusType) {
    case "key-points":
      typeSentence =
        "generando un resumen de los puntos clave del texto original, con frases cortas y concisas";
      break;
    case "narrative":
      typeSentence =
        "generando un resumen del texto con una redacción narrativa, fluida y coherente, dando lugar a parrafos desarrollados";
      break;
    case "bullet-points":
      typeSentence =
        "generando una lista de puntos clave del texto original, en un formato de texto plano pero utilizando oraciones muy cortas y esquemáticas";
      break;
  }

  const requestData = requestTemplate([
    {
      role: "user",
      content: `Eres parte de una aplicación web que ayuda a los usuarios a generar textos de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta un texto entre comillas que contiene una serie de ideas y conceptos. 
        "${data.originalText}"
        Actúa como un experto en análisis de información y resume el texto,${typeSentence}.
        La extensión aproximada del resumen resultante debe ser aproximadamente de el ${extensionSentence} de la extensión del texto original. 
        ${
          data.notes
            ? "Además, ten en cuenta las siguientes consideraciones:\n\n" +
              data.notes
            : ""
        }
        \n
        Es fundamental que devuelvas el texto generado en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita incluir títulos o encabezados en el texto final. Evita dar formato al texto con markdown, HTML o cualquier otro tipo de sistema formato.`,
    },
  ]);
  const sumarizedText = JSON.stringify(await callLMStudioAPI(requestData));
  return { "Texto Resumido": sumarizedText };
};

//------------------------------------ Review Writing ------------------------------------//
export const generateWritingReview = async (data) => {
  let toneSentence = "";
  switch (data.toneStyle) {
    case "informal":
      toneSentence = "informal, coloquial y cercano";
      break;
    case "academic":
      toneSentence = "académico, formal y técnico";
      break;
    case "business":
      toneSentence = "empresarial, profesional y conciso, enfatizando la claridad y la efectividad del mensaje";
      break;
  }

  const feedbackRequest = {
    role: "user",
    content: `Eres parte de una aplicación web que ayuda a los usuarios a generar textos de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta un texto entre comillas que contiene una serie de ideas y conceptos.
        Debes revisar el texto y generar un feedback constructivo, señalando los errores y sugiriendo mejoras. Para esto, ten en cuenta que se busca un tono ${toneSentence}.
        Es fundamental que generes este feedback en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir títulos o encabezados en el texto final. Evita dar formato al texto con markdown, HTML o cualquier otro tipo de sistema formato.`,
  };
  const reviewRequest = {
    role: "user",
    content: `En base a tus comentarios anteriores, genera un resumen del texto, adoptando un tono ${toneSentence}. A continuación se presenta el texto entre comillas:
        "${data.originalText}" 
        Es fundamental que generes este resumen en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita incluir títulos o encabezados en el texto final. Evita dar formato al texto con markdown, HTML o cualquier otro tipo de sistema formato.`,
  };

  const feedbackResponse = JSON.stringify(
    await callLMStudioAPI(requestTemplate([feedbackRequest]))
  );
  const reviewResponse = JSON.stringify(
    await callLMStudioAPI(
      requestTemplate([
        feedbackRequest,
        { role: "assistant", content: feedbackResponse },
        reviewRequest,
      ])
    )
  );
  return { "Corrección de Texto": {"Texto Corregido": reviewResponse},"Feedback": feedbackResponse};
};

//------------------------------------ Shematize Text ------------------------------------//
export const generateShematizedText = async (data) => {
  let typeSentence = "";
  switch (data.schemeType) {
    case "numeric":
      typeSentence =
        "numérico. Es decir, utilizando números para organizar el contenido (ejemplo: 1, 1.1, 1.1.1)";
      break;
    case "alphabetic":
      typeSentence =
        "alfabético. Es decir, utilizando letras y números para organizar el contenido (ejemplo: A, A.1, A.1.1)";
      break;
  }

  let detailSentence = "";
  switch (data.detailLevel) {
    case "high":
      detailSentence = "alto, con todos los subniveles posibles";
      break;
    case "medium":
      detailSentence = "medio, incluyendo los subniveles más relevantes. Debes limitarte como máximo a un solo subnivel, 3 items por subnivel y 15 items en total";
      break;
    case "low":
      detailSentence = "bajo, con los conceptos principales y sin subniveles. Debes limitarte a 5 items en total";
      break;
  }

  const requestData = requestTemplate([
    {
      role: "user",
      content: `Eres parte de una aplicación web que ayuda a los usuarios a generar textos de forma automática.
        Tu tarea es generar contenido de texto en formato plano para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta un texto entre comillas que contiene una serie de ideas y conceptos. 
        "${data.originalText}"
        Actúa como un experto en análisis de textos y esquematiza el contenido del mismo utilizando un formato ${typeSentence}.
        El esquema debe tener un nivel de detalle ${detailSentence}.
        ${
          data.notes
            ? "Además, se debe tener en cuenta las siguientes indicaciones proporcionadas por el usuario de la página web:\n\n" +
              data.notes
            : ""
        }
        \n
        Es fundamental que devuelvas el texto generado en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita incluir títulos o encabezados en el texto final. Evita dar formato al texto con markdown, HTML o cualquier otro tipo de sistema formato.`,
    },
  ]);
  const sumarizedText = JSON.stringify(await callLMStudioAPI(requestData));
  return { "Esquema Generado": sumarizedText };
};

//------------------------------------ Format Text to LaTeX ------------------------------------//
export const formatTextToLatex = async (data) => {
  let documentClass = "";
  switch (data.documentClass) {
    case "article":
      documentClass =
        "un artículo académico. Debe estructurarse en secciones claras con formato académico, cuidando citas, figuras y bibliografía";
      break;
    case "report":
      documentClass =
        "un reporte. Requiere una organización lógica con capítulos o secciones numeradas, resúmenes ejecutivos y apéndices opcionales";
      break;
    case "book":
      documentClass = "un libro. Necesita una jerarquía de capítulos y secciones bien definida, índice automático y gestión de numeración continua";
      break;  
    case "beamer":
      documentClass = "una presentación. Debe adaptarse a un formato visualmente claro, con diapositivas breves, uso de bloques y estilo tipo Beamer";
      break;
  }


  const requestData = requestTemplate([
    {
      role: "user",
      content: `Eres parte de una aplicación web que ayuda a los usuarios a generar textos de forma automática.
        Tu tarea es generar contenido de texto para que la página web lo maneje de forma adecuada.\n\n
        A continuación se presenta un texto entre comillas. 
        "${data.originalText}"
        Actúa como un experto en el formato LaTex y formatea el contenido del texto, 
        generando el código LaTex necesario para adecuar el texto original al estílo propio de ${documentClass}.
        ${
          data.notes
            ? "Además, se debe tener en cuenta las siguientes indicaciones proporcionadas por el usuario de la página web:\n\n" +
              data.notes
            : ""
        }
        \n
        Es fundamental que devuelvas el texto generado en el formato de texto LaTex, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita modificar el texto original. Limítate a formatear el texto original en LaTex según los criterios previos.`,
    },
  ]);
  const sumarizedText = JSON.stringify(await callLMStudioAPI(requestData));
  return { "Texto Prensado": sumarizedText };
};
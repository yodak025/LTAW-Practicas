import {
  TEMPERATURE,
  MAX_TOKENS,
  IS_STREAM,
  LLM_API,
  MODEL,
  callLMStudioAPI,
} from "./documentGenerationUtils";

export const generateExpandedText = async (data) => {
  let extensionTypeSentence = ""
  switch (data.focus) {
    case "details":
      extensionTypeSentence = "añadir más detalles al";
      break;
    case "examples":
      extensionTypeSentence = "ilustrar con ejemplos de";
      break;
    case "context":
      extensionTypeSentence = "expandir el contexto del";
      break;
    case "technical":
      extensionTypeSentence = "profundizar en los aspéctos técnicos del";
      break;
  }

  const requestData = {
    model: MODEL,
    messages: [
      { role: "user", content: 
        `A continuación se presenta un texto que contiene una serie de ideas y conceptos. 
        ${data.originalText}
        Actúa como un experto en redacción y amplía el texto, desarrollando cada idea y concepto de manera clara y detallada.
        La extensión aproximada del texto resultante debe ser aproximadamente de el ${data.targetLength} de la extensión original.
        Concretamente, debes enfocarte en ${extensionTypeSentence} texto original. 
        ${data.notes ? "Además, ten en cuenta las siguientes consideraciones:\n\n" + data.notes : ""}
        \n
        Es fundamental que devuelvas el texto generado en un formato de texto completamente plano, sin etiquetas ni comentarios adicionales.
        Evita incluir comentarios en tu respuesta. Evita incluir títulos o encabezados en el texto final. Evita formatear el texto de ninguna forma.` 
      },
    ],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS, // -1 o ajusta según la cantidad deseada
    stream: IS_STREAM,  // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
    top_p: 1,
    repetition_penalty: 1
  };
  return JSON.stringify(await callLMStudioAPI(requestData));
}
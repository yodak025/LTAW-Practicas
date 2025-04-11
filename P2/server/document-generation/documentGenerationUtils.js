//-------------------------- Constants ----------------------------------------
export const TEMPERATURE = 0.6;
export const MAX_TOKENS = -1;
export const IS_STREAM = false;
export const MODEL = "gemma-3-12b-it"; // Cambia esto al modelo que desees usar

const LLM_API = "http://localhost:1234/v1/chat/completions";

//-------------------------- Functions ----------------------------------------

// Función asíncrona para enviar la petición y procesar la respuesta
export async function callLMStudioAPI(requestData) {
  console.log("Request Data:", requestData);
  try {
    // Enviar la petición POST con el cuerpo en formato JSON
    const response = await fetch(LLM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Imprimir la respuesta en la consola
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

export const requestTemplate = (messages) => {
  return {
    model: MODEL,
    messages: messages,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS, // -1 o ajusta según la cantidad deseada
    stream: IS_STREAM, // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
    top_p: 1,
    repetition_penalty: 1,
  };
}
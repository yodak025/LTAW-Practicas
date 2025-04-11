//-------------------------- Constants ----------------------------------------
export const TEMPERATURE = 0.6;
export const MAX_TOKENS = -1;
export const IS_STREAM = false;
export const MODEL = "meta-llama-3.1-8b-instruct"; // Cambia esto al modelo que desees usar

const LLM_API = "http://localhost:1234/v1/chat/completions";

//-------------------------- Functions ----------------------------------------

// Función asíncrona para enviar la petición y procesar la respuesta
export async function callLMStudioAPI(requestData) {
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
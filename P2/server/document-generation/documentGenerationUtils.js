import printLog from "../logs";

//-------------------------- Constants ----------------------------------------
export const TEMPERATURE = 0.6;
export const MAX_TOKENS = -1;
export const IS_STREAM = false;
export const MODEL = "meta-llama/llama-3.3-70b-instruct:free"; // Cambia esto al modelo que desees usar

const LLM_API_KEY =
  "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";
const LLM_API = `https://openrouter.ai/api/v1/chat/completions`;
//-------------------------- Functions ----------------------------------------

// Función asíncrona para enviar la petición y procesar la respuesta
export async function callLMStudioAPI(requestData) {
  printLog(
    "document-api-request",
    requestData.messages[requestData.messages.length - 1].content,
    { apiAddress: LLM_API, model: MODEL }
  );
  try {
    // Enviar la petición POST con el cuerpo en formato JSON
    const response = await fetch(LLM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + LLM_API_KEY,
      },
      body: JSON.stringify(requestData),
    });

    // Convertir la respuesta a JSON
    const data = await response.json();
    // Imprimir la respuesta en la consola
    let responseText = data.choices[0].message.content;
    printLog("document-api-response", responseText, MODEL);
    return responseText;
  } catch (error) {
    console.error(
      `Error en la conexión con ${MODEL} vía ${LLM_API}: \n`,
      error
    );
  }
}

export const requestTemplate = (messages) => {
  return {
    model: MODEL,
    messages: messages,
  };
};

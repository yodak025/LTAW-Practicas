// Crea el objeto con los datos de la petición
const TEMPERATURE = 0.6;
const MAX_TOKENS = -1;
const IS_STREAM = false;
const LLM_API = "http://localhost:1234/v1/chat/completions";

const generateLlmRequest = (data) => {

  return {
  model: "gemma-3-12b-it",
  messages: [
    { role: "user", content: 
      `Genera una carta de presentación profesional para buscar trabajo. 
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
      Asegurate de entregar una carta de presentación en castellano. Integra las secciones y no incluyas los títulos de las mismas entre **[]** en la respuesta final.` 
    },
  ],
  temperature: TEMPERATURE,
  max_tokens: MAX_TOKENS, // -1 o ajusta según la cantidad deseada
  stream: IS_STREAM,  // Usa 'true' si deseas respuestas en streaming (requiere un manejo especial)
  top_p: 1,
  repetition_penalty: 1
};
};

// Función asíncrona para enviar la petición y procesar la respuesta
async function callLMStudioAPI(requestData) {
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

const documentGenerationRequest = async (request) => {
  const requestData = generateLlmRequest(JSON.parse(request));
  return await callLMStudioAPI(requestData);
}

module.exports = {
  documentGenerationRequest: documentGenerationRequest
};
// Crea el objeto con los datos de la petición
import {
  generateExpandedText,
  generateSumarizedText,
  generateWritingReview,
  generateShematizedText,
  formatTextToLatex
} from "./generateTextExpansions.js";

const documentGenerationRequest = async (requestData, db) => {
  console.log("Request Data:", JSON.stringify(requestData, null));
  const documentType = requestData.resourceDemipath.split("?")[1].split("=")[1];

  let response = undefined;
  switch (documentType) {
    case "extender-texto":
      response = await generateExpandedText(JSON.parse(requestData.body));
      break;
    case "resumir-texto":
      response = await generateSumarizedText(JSON.parse(requestData.body));
      break;
    case "revisar-redaccion":
      response = await generateWritingReview(JSON.parse(requestData.body));
      break;
    case "esquematizar-texto":
      response = await generateShematizedText(JSON.parse(requestData.body));
      break;
    case "prensar-latex":
      response = await formatTextToLatex(JSON.parse(requestData.body));
      break;

    default:
      throw new Error(`Tipo de documento "${documentType}" no soportado`);
  }
  return db.addNewOrder(response, requestData.user, documentType);
};

export default documentGenerationRequest;

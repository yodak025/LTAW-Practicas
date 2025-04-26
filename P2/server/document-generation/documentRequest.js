// Crea el objeto con los datos de la petición
import printLog from "../logs.js";
import {
  generateExpandedText,
  generateSumarizedText,
  generateWritingReview,
  generateShematizedText,
  formatTextToLatex
} from "./generateTextExpansions.js";

import { 
  generateCV, 
  generateCoverLetter, 
  generateExecutiveSummary,
  generateProductDescription,
  generateSalesEmail,
  generateRecommendationLetter
} from "./generateWorkRelatedDocuments.js";

const documentGenerationRequest = async (type, body) => {

  let response = undefined;
  switch (type) {
    case "curriculum-vitae":
      response = await generateCV(JSON.parse(body));
      break;
    case "carta-presentacion":
      response = await generateCoverLetter(JSON.parse(body));
      break;
    case "resumen-ejecutivo":
      response = await generateExecutiveSummary(JSON.parse(body));
      break;
    case "descripcion-producto":
      response = await generateProductDescription(JSON.parse(body));
      break;
    case "email-ventas":
      response = await generateSalesEmail(JSON.parse(body));
      break;
    case "carta-recomendacion":
      response = await generateRecommendationLetter(JSON.parse(body));
      break;
    case "extender-texto":
      response = await generateExpandedText(JSON.parse(body));
      break;
    case "resumir-texto":
      response = await generateSumarizedText(JSON.parse(body));
      break;
    case "revisar-redaccion":
      response = await generateWritingReview(JSON.parse(body));
      break;
    case "esquematizar-texto":
      response = await generateShematizedText(JSON.parse(body));
      break;
    case "prensar-latex":
      response = await formatTextToLatex(JSON.parse(body));
      break;

    default:
      throw new Error(`Tipo de documento "${documentType}" no soportado`);
  }
  printLog("generated-document", response, null);
  return {
    type: type,
    body: response,
  };
};

export default documentGenerationRequest;

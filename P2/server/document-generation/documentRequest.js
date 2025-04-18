// Crea el objeto con los datos de la petición
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

const documentGenerationRequest = async (requestData, db) => {
  console.log("Request Data:", JSON.stringify(requestData, null));
  const documentType = requestData.resourceDemipath.split("?")[1].split("=")[1];

  let response = undefined;
  switch (documentType) {
    case "curriculum-vitae":
      response = await generateCV(JSON.parse(requestData.body));
      break;
    case "carta-presentacion":
      response = await generateCoverLetter(JSON.parse(requestData.body));
      break;
    case "resumen-ejecutivo":
      response = await generateExecutiveSummary(JSON.parse(requestData.body));
      break;
    case "descripcion-producto":
      response = await generateProductDescription(JSON.parse(requestData.body));
      break;
    case "email-ventas":
      response = await generateSalesEmail(JSON.parse(requestData.body));
      break;
    case "carta-recomendacion":
      response = await generateRecommendationLetter(JSON.parse(requestData.body));
      break;
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

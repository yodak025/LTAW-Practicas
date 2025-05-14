import React from "react";

import Layout from "./Layout/Layout.jsx";
import Nav from "./Nav/Nav.jsx";
import Products from "./Contents/Products.jsx";
import ProductPage from "./Contents/ProductPage.jsx";
import ProcessOrder from "./Contents/ProcessOrder.jsx";
import LoginPage from "./Contents/Login.jsx";
import Error404 from "./Contents/Error404.jsx";
import Document from "./Document/Document.jsx";
import MyDocuments from "./Contents/MyDocuments.jsx";

import CVForm from "./Forms/CVForm.jsx";
import CoverLetterForm from "./Forms/CoverLetterForm.jsx";
import ExecutiveSummaryForm from "./Forms/ExecutiveSummaryForm.jsx";
import ProductDescriptionForm from "./Forms/ProductDescriptionForm.jsx";
import SalesEmailForm from "./Forms/SalesEmailForm.jsx";
import RecommendationLetterForm from "./Forms/RecommendationLetterForm.jsx";

import ExtendTextForm from "./Forms/ExtendTextForm.jsx";
import LatexTextForm from "./Forms/LatexTextForm.jsx";
import ReviewTextForm from "./Forms/ReviewTextForm.jsx";
import SchematizeTextForm from "./Forms/SchematizeTextForm.jsx";
import SummarizeTextForm from "./Forms/SummarizeTextForm.jsx";

/**
 * @component App
 * @description
 * Componente principal de la aplicación.
 * Renderiza el contenido según la propiedad "content" pasada como prop.
 * Contiene la barra de navegación y el contenido correspondiente.
 * @param {props} props
 * @param {string} props.content - Nombre del contenido a renderizar 
 * @param {string} [props.userName] - Nombre del usuario
 * @param {string} [props.document] - Estructura del documento
 * @param {string} [props.documents] - Documentos del usuario
 * @returns {JSX.Element} - El elemento aplicación.
 */

export default function App({ props }) {
  const content = props.content;
  switch (content) {
    case "Products":
      return (
        <Layout>
          <Nav user={props.userName} />
          <Products className="os-layout-products" />
        </Layout>
      );
    case "Document":
      const structure = props.document;
      return (
        <Layout>
          <Nav user={props.userName} />
          <Document structure={structure} />
        </Layout>
      );
    case "Login":
      return (
        <Layout>
          <Nav user={null} />
          <LoginPage className="os-layout-login" />
        </Layout>
      );
    case "ProcessOrder":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ProcessOrder />
        </Layout>
      );
    case "MyDocuments":
      return (
        <Layout>
          <Nav user={props.userName} />
          <MyDocuments documents={props.documents} />
        </Layout>
      );
    case "Error404":
      return (
        <Layout>
          <Nav user={props.userName} />
          <Error404 className="os-layout-error404" />
        </Layout>
      );
    // --------------- Forms ------------------------------------------
    case "CV":
      return (
        <Layout>
          <Nav user={props.userName} />
          <CVForm />
        </Layout>
      );
    case "CoverLetter":
      return (
        <Layout>
          <Nav user={props.userName} />
          <CoverLetterForm />
        </Layout>
      );
    case "ProductPage":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ProductPage />
        </Layout>
      );
    case "Review":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ReviewTextForm />
        </Layout>
      );
    case "Summarize":
      return (
        <Layout>
          <Nav user={props.userName} />
          <SummarizeTextForm />
        </Layout>
      );
    case "Schematize":
      return (
        <Layout>
          <Nav user={props.userName} />
          <SchematizeTextForm />
        </Layout>
      );
    case "Extend":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ExtendTextForm />
        </Layout>
      );
    case "Latex":
      return (
        <Layout>
          <Nav user={props.userName} />
          <LatexTextForm />
        </Layout>
      );
    case "ExecutiveSummary":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ExecutiveSummaryForm />
        </Layout>
      );
    case "ProductDescription":
      return (
        <Layout>
          <Nav user={props.userName} />
          <ProductDescriptionForm />
        </Layout>
      );
    case "SalesEmail":
      return (
        <Layout>
          <Nav user={props.userName} />
          <SalesEmailForm />
        </Layout>
      );
    case "RecommendationLetter":
      return (
        <Layout>
          <Nav user={props.userName} />
          <RecommendationLetterForm />
        </Layout>
      );
    default:
  }
}

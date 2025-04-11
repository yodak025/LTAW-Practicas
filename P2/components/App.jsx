import React from "react";

import Layout from "./Layout/Layout.jsx";
import Nav from "./Nav/Nav.jsx";
import Products from "./Contents/Products.jsx";
import ProductPage from "./Contents/ProductPage.jsx";
import LoginPage from "./Contents/Login.jsx";
import Error404 from "./Contents/Error404.jsx";
import Document from "./Document/Document.jsx";

import CVForm from "./Forms/CVForm.jsx";

import ExtendTextForm from "./Forms/ExtendTextForm.jsx";
import LatexTextForm from "./Forms/LatexTextForm.jsx";
import ReviewTextForm from "./Forms/ReviewTextForm.jsx";
import SchematizeTextForm from "./Forms/SchematizeTextForm.jsx";
import SummarizeTextForm from "./Forms/SummarizeTextForm.jsx";

export default function App({ props }) {
  const content = props.content;
  switch (content) {
    case "Products":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <Products className="os-layout-products" />
        </Layout>
      );
    case "Document":
      const structure = props.document;
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <Document structure={structure} />
        </Layout>
      );
    case "Login":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <LoginPage className="os-layout-login" />
        </Layout>
      );
    case "Error404":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <Error404 className="os-layout-error404" />
        </Layout>
      );
    // --------------- Forms ------------------------------------------
    case "CV":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <CVForm />
        </Layout>
      );
    case "ProductPage":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <ProductPage />
        </Layout>
      );
      case "Review":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <ReviewTextForm />
        </Layout>
      );
      case "Summarize":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <SummarizeTextForm />
        </Layout>
      );
      case "Schematize":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <SchematizeTextForm />
        </Layout>
      );
    case "Extend":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <ExtendTextForm />
        </Layout>
      );
    case "Latex":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <LatexTextForm />
        </Layout>
      );
    default:
  }
}

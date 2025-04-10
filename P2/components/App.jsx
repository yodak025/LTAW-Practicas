import React from "react";

import Layout from "./Layout/Layout.jsx";
import Nav from "./Nav/Nav.jsx";
import Products from "./Contents/Products.jsx";
import ExtendTextForm from "./Forms/ExtendTextForm.jsx";
import LoginPage from "./Contents/Login.jsx";
import Error404 from "./Contents/Error404.jsx";
import Document from "./Document/Document.jsx";

export default function App ({props}){
  const content = props.content;
  switch (content){
    case "Products":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          <Products className="os-layout-products" />
        </Layout>
      );
    case "ProductPage":
      return (
        <Layout>
          <Nav className="os-layout-nav" />
          < ExtendTextForm />
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
    default:
  }

}
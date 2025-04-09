import React from "react";

import Layout from "../components/Layout/Layout.jsx";
import Nav from "../components/Nav/Nav.jsx";
import Products from "../components/Contents/Products.jsx";
import ExtendTextForm from "../components/Forms/ExtendTextForm.jsx";
import LoginPage from "../components/Contents/Login.jsx";
import Error404 from "../components/Contents/Error404.jsx";

export default function App ({content}){
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
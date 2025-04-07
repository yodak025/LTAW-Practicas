import React from "react";
import { useState } from "react";
import Layout from "../Layout/Layout.jsx";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <div className="auth-container">
        <h1 className="auth-title">Bienvenido a la Tienda</h1>
        <p className="auth-description">
          {isLogin 
            ? "Inicia sesión para acceder a tu cuenta" 
            : "Crea una cuenta nueva para empezar a comprar"
          }
        </p>
        
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`}>
            <button onClick={() => setIsLogin(true)}>
              Login
            </button>
            <span className="auth-tab-desc">Ya tengo cuenta</span>
          </div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`}>
            <button onClick={() => setIsLogin(false)}>
              Register
            </button>
            <span className="auth-tab-desc">Crear cuenta nueva</span>
          </div>
        </div>
        
        {isLogin ? (
          <form className="auth-form" action="/login" method="get">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required 
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="auth-form" action="/register" method="get">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required 
            />
            <input 
              type="text" 
              name="fullname" 
              placeholder="Full Name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              required 
            />
            <button type="submit">Register</button>
          </form>
        )}
      </div>
    </Layout>
  );
};

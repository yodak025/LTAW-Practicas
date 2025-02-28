import React from 'react';
import Nav from './Nav'
import './Layout.css'

function Layout({ children }) {
  return (
    <>
      <Nav className="os-layout-nav"/>
      <main>
        {children}
      </main>

      <footer className='os-layout-footer'>
        <p>
        <s>ⓒ</s> Yodak025 2025. No Rights Reserved 
        </p>
      </footer>
    </>
  );
}

export default Layout;
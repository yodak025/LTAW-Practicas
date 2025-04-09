import React from 'react';


function Layout({ children }) {
  return (
    <> 
      <main>
        {children}
      </main>

      <footer className='os-layout-footer'>
        <p>
        <s>ⓒ</s> 2025 Yodak025 . No Rights Reserved 
        </p>
      </footer>
    </>
  );
}

export default Layout;
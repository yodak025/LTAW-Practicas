import './App.css'
import Layout from './components/Layout/Layout';
import Product from './components/Product/Product';
import Category from './components/Category/Category';


function App() {
  return (
    <>
      <Layout>
      {/* Contenido específico de la página principal */}
        <header className='os-pageFront'>
          <h1>FRONT PAGE</h1>
        </header>
        <Category name="Empleo">
          <Product name="Currículum Vitae Personalizado" logoSrc="../public/document-icon.svg" index="1"/>
          <Product name="Carta de Presentación" logoSrc="../public/document-icon.svg" index="2"/>
          <Product name="name 3" description="Description" price="NaN" index="3"/>
          <Product name="name 4" description="Description" price="NaN" index="4"/>
          <Product name="name 5" description="Description" price="NaN" index="5"/>
          <Product name="name 6" description="Description" price="NaN" index="6"/>
          <Product name="name 7" description="Description" price="NaN" index="7"/>
        </Category>
        <Category name="Ventas">
          <Product name="Descripción de Producto Optimizada Para SEO" description="Description" price="NaN" index="1"/>
          <Product name="Email de Ventas" description="Description" price="NaN" index="2"/>
        </Category> 
        <Category name="Ciencia e Ingeniería">
          <Product name="Abstract Científico" description="Description" price="NaN" index="1"/>
        </Category> 
        <Category name="Empresa">
          <Product name="Resumen Ejecutivo" description="Description" price="NaN" index="1"/>
        </Category> 
        <Category name="Redes Sociales">
          <Product name="Guión para vídeo de Youtube" description="Description" price="NaN" index="1"/>
          <Product name="Descripción para Youtube" description="Description" price="NaN" index="2"/>
          <Product name="Descripción para Instagram" description="Description" price="NaN" index="3"/>
        </Category> 
        <Category name="Estudiantes">
          <Product name="Tarjetas anki" description="Description" price="NaN" index="1"/>
          <Product name="Revisar Redacción" description="Description" price="NaN" index="2"/>
        </Category> 
    </Layout>
    </>
  )
}

export default App

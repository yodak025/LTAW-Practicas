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
          <section className='os-pageFront-text'>
            <h1 className='os-pageFront-text-title'>¡Bienvenido a tu tienda de servicios de redacción!</h1>
            <p className='os-pageFront-text-info'>
              ¿Necesitas ayuda con la redacción de algún documento? ¡Estás en el lugar correcto! En nuestra tienda encontrarás una gran variedad de servicios de redacción para ayudarte a crear el documento
              que necesitas. Desde currículums hasta descripciones de productos, pasando por guiones para vídeos de Youtube, ¡aquí encontrarás todo lo que necesitas!
            </p>

          </section>
          <section className='os-pageFront-image'>
            <img src='https://placehold.co/400' alt='pageFrontImg'/>
          </section>
        </header>
        <Category name="Empleo">
          <Product name="Currículum Vitae Personalizado" logoSrc="../public/document-icon.svg" index="1"/>
          <Product name="Carta de Presentación" logoSrc="../public/document-icon.svg" index="2"/>
          <Product name="name 3" index="3"/>
          <Product name="name 4" index="4"/>
          <Product name="name 5" index="5"/>
          <Product name="name 6" index="6"/>
          <Product name="name 7" index="7"/>
        </Category>
        <Category name="Ventas">
          <Product name="Descripción de Producto" description="Description" price="NaN" index="1"/>
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

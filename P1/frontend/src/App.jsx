import './App.css'
import Layout from './components/Layout/Layout';
import Product from './components/Product/Product';
import Category from './components/Category/Category';
import { FrontImg } from './components/FrontImg';


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
            <FrontImg className="--firstColor --secondColor"/>
          </section>
        </header>

        {/* CUIDADO!! Los nombres identifican los iconos */}
        <main id='products'>
          <Category name="Documentos Laborales">
            <Product name="Currículum Vitae Personalizado" index="1"/>
            <Product name="Carta de Presentación" index="2"/>
            <Product name="Resumen ejecutivo" index="3"/>
            <Product name="Descripción de Producto" index="4"/>
            <Product name="Email de Ventas" index="5"/>
            <Product name="Carta de Recomendación" index="6"/>
          </Category>

          <Category name="Documentos Legales">
            <Product name="Contrato Laboral" index="1"/>
            <Product name="Contrato de Compraventa" index="2"/>
            <Product name="Contrato de Arrendamiento" index="3"/>
            <Product name="Acuerdo de Confidencialidad" index="4"/>
            <Product name="Testamento" index="5"/>
            <Product name="Acta de Reunión" index="6"/>
          </Category> 

          <Category name="Documentos Académicos">
            <Product name="Abstract Científico" index="1"/>
            <Product name="Tarjeta Anki" index="2"/>
            <Product name="Ensayo" index="3"/>
            <Product name="Comentario de Texto" index="4"/>
            <Product name="Test" index="5"/>
            <Product name="Examen de Problemas" index="6"/>
            <Product name="Revisar Redacción" index="7"/>
            <Product name="Resumir Texto" index="8"/>
            <Product name="Esquematizar Texto" index="9"/>
            <Product name="Extender Texto" index="10"/>
            <Product name="Prensar Texto" index="11"/> 
          </Category> 
          
          <Category name="Web y Redes Sociales">
            <Product name="Guión para vídeo de Youtube" index="1"/>
            <Product name="Guión para Podcast" index="2"/>
            <Product name="Descripción para Youtube" index="3"/>
            <Product name="Post para Instagram" index="4"/>
            <Product name="Post para Twitter" index="5"/>
            <Product name="Artículo de Opinión" index="6"/>
          </Category> 
        </main>
    </Layout>
    </>
  )
}

export default App

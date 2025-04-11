import React from "react";
import Product from '../Product/Product';
import Category from '../Category/Category';
import { FrontImg } from '../FrontImg';


function Products() {
  return (
    <>
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
            <Product name="Currículum Vitae Personalizado" id="dev" index="1"/>
            <Product name="Carta de Presentación" id="dev" index="2"/>
            <Product name="Resumen ejecutivo" id="dev" index="3"/>
            <Product name="Descripción de Producto" id="dev" index="4"/>
            <Product name="Email de Ventas" id="dev" index="5"/>
            <Product name="Carta de Recomendación" id="dev" index="6"/>
          </Category>

          <Category name="Documentos Legales">
            <Product name="Contrato Laboral" id="dev" index="1"/>
            <Product name="Contrato de Compraventa" id="dev" index="2"/>
            <Product name="Contrato de Arrendamiento" id="dev" index="3"/>
            <Product name="Acuerdo de Confidencialidad" id="dev" index="4"/>
            <Product name="Testamento" id="dev" index="5"/>
            <Product name="Acta de Reunión" id="dev" index="6"/>
          </Category> 

          <Category name="Documentos Académicos">
            <Product name="Abstract Científico" id="dev" index="1"/>
            <Product name="Tarjeta Anki" id="dev" index="2"/>
            <Product name="Ensayo" id="dev" index="3"/>
            <Product name="Comentario de Texto" id="dev" index="4"/>
            <Product name="Test" id="dev" index="5"/>
            <Product name="Examen de Problemas" id="dev" index="6"/>
          </Category> 
          
          <Category name="Web y Redes Sociales">
            <Product name="Guión para vídeo de Youtube" id="dev" index="1"/>
            <Product name="Guión para Podcast" id="dev" index="2"/>
            <Product name="Descripción para Youtube" id="dev" index="3"/>
            <Product name="Post para Instagram" id="dev" index="4"/>
            <Product name="Post para Twitter" id="dev" index="5"/>
            <Product name="Artículo de Opinión" id="dev" index="6"/>
          </Category> 

          <Category name="Editar Texto">
            <Product name="Revisar Redacción" id="revisar-redaccion" index="1"/>
            <Product name="Resumir Texto" id="resumir-texto" index="2"/>
            <Product name="Esquematizar Texto" id="esquematizar-texto" index="3"/>
            <Product name="Extender Texto" id="extender-texto" index="4"/>
            <Product name="Prensar Texto" id="prensar-latex" index="5"/> 
          </Category>
        </main>
    </>
  )
}

export default Products

import React from 'react'

const DemoText = () => (
  <section className="os-product-demo">
    <h1>El Impacto de la Inteligencia Artificial en la Creatividad Humana</h1>
    
    <section className="os-essay-section">
      <h2>Introducción</h2>
      <p>
        En la era digital actual, la inteligencia artificial (IA) ha transformado 
        significativamente nuestra forma de vida y trabajo. Un área particularmente 
        interesante es su influencia en la creatividad humana. Este ensayo explora 
        la compleja relación entre la IA y la expresión creativa, argumentando que, 
        lejos de suplantar la creatividad humana, la IA está actuando como un 
        catalizador para nuevas formas de expresión artística.
      </p>
    </section>

    <section className="os-essay-section">
      <h2>Desarrollo</h2>
      <h3>La IA como Herramienta Creativa</h3>
      <p>
        Las herramientas de IA están revolucionando los procesos creativos tradicionales. 
        Los artistas digitales utilizan algoritmos generativos para explorar nuevas 
        posibilidades estéticas, mientras que los músicos colaboran con sistemas de IA 
        para componer piezas innovadoras. Esta simbiosis entre humano y máquina está 
        expandiendo los límites de lo posible en el arte.
      </p>
      
      <h3>El Debate sobre la Autenticidad</h3>
      <p>
        Sin embargo, surge la pregunta sobre la autenticidad de las obras creadas con 
        asistencia de IA. ¿Puede considerarse verdaderamente creativo algo generado 
        parcialmente por algoritmos? La evidencia sugiere que la IA funciona más como 
        un pincel en manos del artista que como un reemplazo del proceso creativo humano.
      </p>
    </section>

    <section className="os-essay-section">
      <h2>Conclusión</h2>
      <p>
        La integración de la IA en los procesos creativos no disminuye la importancia 
        del ingenio humano; por el contrario, está abriendo nuevos horizontes para la 
        expresión artística. El futuro de la creatividad probablemente resida en una 
        colaboración armoniosa entre la intuición humana y las capacidades computacionales 
        de la IA.
      </p>
    </section>

    <section className="os-essay-section">
      <h2>Referencias</h2>
      <ul className="os-essay-references">
        <li>Smith, J. (2023). "AI and Creativity: A New Frontier"</li>
        <li>García, M. (2022). "The Future of Digital Art"</li>
      </ul>
    </section>
  </section>
)

export default function ProductPage () {
  return(
      <main className="os-product-page">
        <section className="os-product-content">
          <div className="os-product-notice">
            <h2>Versión de Demostración</h2>
            <p>
              Esta es una versión de demostración de la tienda. La funcionalidad de 
              generación de documentos no está implementada en esta versión.
            </p>
            <p>
              A continuación se muestra un ejemplo del formato que tendría el documento generado:
            </p>
          </div>
          <DemoText />
        </section>
      </main>
  )
}

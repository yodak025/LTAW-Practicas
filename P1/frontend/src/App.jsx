import './App.css'
import Layout from './components/Layout';
import Product from './components/Product';
import Container from './components/Container';

function App() {
  return (
    <>
      <Layout>
      {/* Contenido específico de la página principal */}
      
        <Container>
          <h1>Bienvenido a la Tienda</h1>
          <p>Encuentra los mejores productos aquí!</p>
        </Container>
        <Product name="name1" description="Description" price="NaN" index="1"/>
        <Product name="name2" description="Description" price="NaN" index="2"/>
        <Product name="name3" description="Description" price="NaN" index="3"/>
    </Layout>
    </>
  )
}

export default App

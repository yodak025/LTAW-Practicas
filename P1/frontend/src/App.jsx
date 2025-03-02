import './App.css'
import Layout from './components/Layout';
import Product from './components/Product';

function App() {
  return (
    <>
      <Layout>
      {/* Contenido específico de la página principal */}
      <h1>Bienvenido a la Tienda</h1>
      <ul>
        <Product />
        <Product />
        <Product />

      </ul>
    </Layout>
    </>
  )
}

export default App

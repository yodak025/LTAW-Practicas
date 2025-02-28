import './App.css'
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Layout>
      {/* Contenido específico de la página principal */}
      <h1>Bienvenido a la Tienda</h1>
      <ul>
        <li><a href="product-1.html">Producto 1</a></li>
        <li><a href="product-2.html">Producto 2</a></li>
        <li><a href="product-3.html">Producto 3</a></li>
      </ul>
    </Layout>
    </>
  )
}

export default App

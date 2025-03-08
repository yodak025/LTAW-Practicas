import './App.css'
import Layout from './components/Layout';
import Product from './components/Product';
import Category from './components/Category';


function App() {
  return (
    <>
      <Layout>
      {/* Contenido específico de la página principal */}
        <header className='os-pageFront'>
          <h1>FRONT PAGE</h1>
        </header>
        <Category name="Ciencia e Ingeniería">
          <Product name="name 1" logoSrc="../public/vite.svg" index="1"/>
          <Product name="name 2" logoSrc="../src/assets/react.svg" index="2"/>
          <Product name="name 3" description="Description" price="NaN" index="3"/>
          <Product name="name 4" description="Description" price="NaN" index="4"/>
          <Product name="name 5" description="Description" price="NaN" index="5"/>
          <Product name="name 6" description="Description" price="NaN" index="6"/>
          <Product name="name 7" description="Description" price="NaN" index="7"/>
        </Category>
        <Category name="Empleo">
          <Product name="name 1" description="Description" price="NaN" index="1"/>
          <Product name="name 2" description="Description" price="NaN" index="2"/>
          <Product name="name 3" description="Description" price="NaN" index="3"/>
        </Category> 
    </Layout>
    </>
  )
}

export default App

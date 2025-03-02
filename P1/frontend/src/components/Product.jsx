import './Product.css'
import Container from './Container'

const oddOrEven = (index) => (index % 2 === 0) ? 'os-product os-product-even' : 'os-product'

export default function Product({name, description, price, index}) {
  return (
    <Container className={oddOrEven(index)}>
      <img className="os-product-img" src="../../public/vite.svg" alt="Imagen de Producto" />
      <main className="os-product-info">
        <h3>{name}</h3>
        <article>
          <p>{description}</p>
          <div>
            <span>{`Precio:${price}$`}</span>
            <button>Entrar</button>
          </div>
        </article>
      </main>
    </Container>
  )
}
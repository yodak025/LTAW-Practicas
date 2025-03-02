import './Product.css'
export default function Product() {
  return (
    <section className="os-product">
      <img className="os-product-img" src="https://placehold.co/100x100?text=Product Img" alt="Imagen de Producto" />
      <main className="os-product-info">
        <h3>Nombre del producto</h3>
        <article>
          <p>Descripción del producto</p>
          <div>
            <span>Precio $</span>
            <button>Entrar</button>
          </div>
        </article>
      </main>
    </section>
  )
}
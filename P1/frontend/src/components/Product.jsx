import "./Product.css";

const setToClassIfEven = (index) => (index % 2 === 0 ? " --even" : "");

export default function Product({ name, logoSrc, index }) {
  return (
    <main className={`os-product${setToClassIfEven(index)}`}>
      <section className={`os-product-info${setToClassIfEven(index)}`}>
        <h3 className={`os-product-title${setToClassIfEven(index)}`}>{name}</h3>
        <button className={`os-product-btn${setToClassIfEven(index)}`}>
          Generate Product
        </button>
      </section>
      <img
        className={`os-product-logo${setToClassIfEven(index)}`}
        src={logoSrc}
        alt={`Logo del Producto ${name}`}
      />
    </main>
  );
}

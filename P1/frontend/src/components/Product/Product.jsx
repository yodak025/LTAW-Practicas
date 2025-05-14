import "./Product.css";
import { Icon } from "./ProductIcon";

/**
 * Función que devuelve una clase CSS basada en el índice del producto.
 * @param {number} index - Índice del producto.
 * @return {string} - Clase CSS que indica si el índice es par o impar.
 */
const setToClassIfEven = (index) => (index % 2 === 0 ? " --even" : "");

/**
 * Función que divide un nombre en líneas para ajustarse a un ancho mínimo.
 * @param {string} name - Nombre del producto.
 * @return {Array<string>} - Array de líneas de texto.
 */
const returnTitleLinesArray = (name) => {
  const MIN_LINE_LENGTH = 18;
  let words = name.split(" ");
  let lines = [];
  let lineBuffer = "";
  words.forEach((word) => {
    if (lineBuffer.length + word.length < MIN_LINE_LENGTH) {
      lineBuffer += word + " ";
    } else {
      lines.push(lineBuffer.trim());
      lineBuffer = word + " ";
    }
  });
  lines.push(lineBuffer.trim());
  return lines;
};

/**
 * Componente de producto que muestra información y un ícono del producto.
 * @param {Object} props - Props del componente.
 * @param {string} props.name - Nombre del producto.
 * @param {number} props.index - Índice del producto en la lista.
 * @returns {JSX.Element} - Un elemento que representa el producto y su información.
 * @description
 * Este componente muestra el nombre del producto, un botón para generar el producto
 * y un ícono asociado al producto.
 */
export default function Product({ name, index }) {
  return (
    <main className={`os-product${setToClassIfEven(index)}`}>
      <section className={`os-product-info${setToClassIfEven(index)}`}>
        <h3 className={`os-product-title${setToClassIfEven(index)}`}>
          {returnTitleLinesArray(name).map((line, i) => (
            <span
              key={i}
              className={`os-product-title-word${setToClassIfEven(index)}`}
            >
              {line}
            </span>
          ))}
        </h3>
        <a
          className={`os-product-btn${setToClassIfEven(index)}`}
          href="../../product.html"
        >
          Generar Documento!
        </a>
      </section>
      <Icon
        iconName={name}
        className={`os-product-logo${setToClassIfEven(index)}`}
      />
    </main>
  );
}

import React from "react";
import {Icon} from "./ProductIcon"

const setToClassIfEven = (index) => (index % 2 === 0 ? " --even" : "");

const returnTitleLinesArray = (name) => {
  const MIN_LINE_LENGTH = 18
  let words = name.split(' ')
  let lines = []
  let lineBuffer = ""
  words.forEach(word => {
    if (lineBuffer.length + word.length < MIN_LINE_LENGTH) {
      lineBuffer += word + " "
    } else { 
      lines.push(lineBuffer.trim())
      lineBuffer = word + " "
    }
  });
  lines.push(lineBuffer.trim())
  return lines
};

export default function Product({ name, id ,index }) {
  return (
    <main className={`os-product${setToClassIfEven(index)}`}>
      <section className={`os-product-info${setToClassIfEven(index)}`}>
        <h3 className={`os-product-title${setToClassIfEven(index)}`}>
          { returnTitleLinesArray(name).map((line, i) => (
              <span 
                key={i} 
                className={`os-product-title-word${setToClassIfEven(index)}`}
              >
                {line}
              </span>
            )) }
        </h3>
        <a 
          className={`os-product-btn${setToClassIfEven(index)}`}
          href= {`/product.html?type=${id}`}
        >
          Generate Product
        </a>
      </section>
      <Icon iconName={name} className={`os-product-logo${setToClassIfEven(index)}`} />
    </main>
  );
}

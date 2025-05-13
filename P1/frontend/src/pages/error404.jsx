import { createRoot } from "react-dom/client";
import "../App.css";
import Layout from "../components/Layout/Layout.jsx";

/**
 * 
 * @returns {JSX.Element} - Un elemento que representa la página de error 404.
 * @description
 * Este componente muestra un mensaje de error 404 y una imagen relacionada.
 * Es, digamos, un pequeño easter egg que he dejado para que lo encuentres.
 * En el momento que lo diseñé, no sabía que iba a acabar reimplementando el juego.
 * Era un simple guiño nostálgico, pero ha envejecido como el buen vino.
 */

const Error404 = () => {
  return (
    <Layout>
      <header className="os-pageFront">
        <section className="os-pageFront-text">
          <h1 className="os-pageFront-text-title">Error 404</h1>
          <p className="os-pageFront-text-info">
            La página que estás buscando no existe. Puede que haya sido
            eliminada o que nunca haya existido.
          </p>
          <p className="os-pageFront-text-info">
            Por favor, verifica la URL o vuelve a la página de inicio.
          </p>
          <p className="os-pageFront-text-info">
            Pero bueno... ¿Conoces al <strong>Blue Bird</strong>? ¿Y a su amigo
            el <strong>Green Bird</strong>? ¿¿¡¿¡Como!?!?! ¿Que nunca jugaste{" "}
            <strong>Kill Two Birds With One Stone</strong>...?
          </p>
        </section>
        <section className="os-pageFront-image">
          <img
            style={{ height: "30vh" }}
            src={`../../src/assets/GreenBird/3.png`}
            alt="Error 404"
          />
          <img
            style={{ height: "30vh" }}
            src={`../../src/assets/BlueBird/0.png`}
            alt="Error 404"
          />
        </section>
      </header>
    </Layout>
  );
};

createRoot(document.getElementById("root")).render(<Error404 />);

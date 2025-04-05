import { c as s, j as e, L as r } from "./Layout-B1SdolMb.js";
const o = () =>
  e.jsx(r, {
    children: e.jsxs("header", {
      className: "os-pageFront",
      children: [
        e.jsxs("section", {
          className: "os-pageFront-text",
          children: [
            e.jsx("h1", {
              className: "os-pageFront-text-title",
              children: "Error 404",
            }),
            e.jsx("p", {
              className: "os-pageFront-text-info",
              children:
                "La página que estás buscando no existe. Puede que haya sido eliminada o que nunca haya existido.",
            }),
            e.jsx("p", {
              className: "os-pageFront-text-info",
              children:
                "Por favor, verifica la URL o vuelve a la página de inicio.",
            }),
            e.jsxs("p", {
              className: "os-pageFront-text-info",
              children: [
                "Pero bueno... ¿Conoces al ",
                e.jsx("strong", { children: "Blue Bird" }),
                "? ¿Y a su amigo el ",
                e.jsx("strong", { children: "Green Bird" }),
                "? ¿¿¡¿¡Como!?!?! ¿Que nunca jugaste ",
                e.jsx("strong", { children: "Kill Two Birds With One Stone" }),
                "...?",
              ],
            }),
          ],
        }),
        e.jsxs("section", {
          className: "os-pageFront-image",
          children: [
            e.jsx("img", {
              style: { height: "30vh" },
              src: "../../assets/GreenBird/3.png",
              alt: "Error 404",
            }),
            e.jsx("img", {
              style: { height: "30vh" },
              src: "../../assets/BlueBird/0.png",
              alt: "Error 404",
            }),
          ],
        }),
      ],
    }),
  });
s.createRoot(document.getElementById("root")).render(e.jsx(o, {}));

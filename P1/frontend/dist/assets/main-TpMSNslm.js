import { j as e, r as o, L as E, c as C } from "./Layout-Csrn3lNT.js";
const c = (i) => (i % 2 === 0 ? " --even" : "");
function t({ name: i, logoSrc: r, index: s }) {
  return e.jsxs("main", {
    className: `os-product${c(s)}`,
    children: [
      e.jsxs("section", {
        className: `os-product-info${c(s)}`,
        children: [
          e.jsx("h3", { className: `os-product-title${c(s)}`, children: i }),
          e.jsx("button", {
            className: `os-product-btn${c(s)}`,
            children: "Generate Product",
          }),
        ],
      }),
      e.jsx("img", {
        className: `os-product-logo${c(s)}`,
        src: r,
        alt: `Logo del Producto ${i}`,
      }),
    ],
  });
}
const g = 300; //!-- Debe ser consistente con la duración de la transición CSS
function N({ name: i, children: r }) {
  const [s, m] = o.useState(0),
    [u, j] = o.useState(1),
    [a, d] = o.useState(!1),
    l = o.useRef(null),
    p = Array.isArray(r) ? r : [r],
    x = p.length - (u - 1);
  o.useEffect(() => {
    const n = () => {
      if (!l.current) return;
      const w = l.current.clientWidth - 40,
        y = (30 * window.innerHeight) / 100 + 10,
        A = Math.max(1, Math.floor(w / y));
      j(A);
    };
    return (
      n(),
      window.addEventListener("resize", n),
      () => window.removeEventListener("resize", n)
    );
  }, []);
  const f = () => {
      a ||
        (d(!0),
        setTimeout(() => {
          m((n) => Math.max(0, n - 1)), d(!1);
        }, g));
    },
    b = () => {
      a ||
        (d(!0),
        setTimeout(() => {
          m((n) => Math.min(x - 1, n + 1)), d(!1);
        }, g));
    },
    h = s,
    P = p.slice(h, h + u),
    v = a ? "animating" : "";
  return e.jsxs("main", {
    className: "os-category",
    children: [
      e.jsx("h2", { className: "os-category-title", children: i }),
      e.jsxs("section", {
        className: "os-category-productsContainer",
        ref: l,
        children: [
          e.jsx("button", {
            className: "os-category-btn --backward",
            onClick: f,
            disabled: s === 0 || a,
            children: "<",
          }),
          e.jsx("section", {
            className: `os-category-slidingContainer ${v}`,
            children: P,
          }),
          e.jsx("button", {
            className: "os-category-btn --forward",
            onClick: b,
            disabled: s >= x - 1 || a,
            children: ">",
          }),
        ],
      }),
    ],
  });
}
function D() {
  return e.jsx(e.Fragment, {
    children: e.jsxs(E, {
      children: [
        e.jsx("header", {
          className: "os-pageFront",
          children: e.jsx("h1", { children: "FRONT PAGE" }),
        }),
        e.jsxs(N, {
          name: "Ciencia e Ingeniería",
          children: [
            e.jsx(t, {
              name: "name 1",
              logoSrc: "../public/vite.svg",
              index: "1",
            }),
            e.jsx(t, {
              name: "name 2",
              logoSrc: "../src/assets/react.svg",
              index: "2",
            }),
            e.jsx(t, {
              name: "name 3",
              description: "Description",
              price: "NaN",
              index: "3",
            }),
            e.jsx(t, {
              name: "name 4",
              description: "Description",
              price: "NaN",
              index: "4",
            }),
            e.jsx(t, {
              name: "name 5",
              description: "Description",
              price: "NaN",
              index: "5",
            }),
            e.jsx(t, {
              name: "name 6",
              description: "Description",
              price: "NaN",
              index: "6",
            }),
            e.jsx(t, {
              name: "name 7",
              description: "Description",
              price: "NaN",
              index: "7",
            }),
          ],
        }),
        e.jsxs(N, {
          name: "Empleo",
          children: [
            e.jsx(t, {
              name: "name 1",
              description: "Description",
              price: "NaN",
              index: "1",
            }),
            e.jsx(t, {
              name: "name 2",
              description: "Description",
              price: "NaN",
              index: "2",
            }),
            e.jsx(t, {
              name: "name 3",
              description: "Description",
              price: "NaN",
              index: "3",
            }),
          ],
        }),
      ],
    }),
  });
}
C.createRoot(document.getElementById("root")).render(e.jsx(D, {}));

export default {
  content: ["./*.html", "./Public/**/*.{html,js}"],
  theme: {
    extend: {
       colors: {
        azulClaro: "var(--color-AC)",
        azulMedio: "var(--color-AM)",
        azulFuerte: "var(--color-AF)",
        rojo: "var(--color-R)",
        crema: "var(--color-B)"
      },
      fontFamily: {
        quicksilver: ["var(--letra-Quicksilver)"],
        afacado: ["var(--letra-Afacado)"],
        staatliches: ["var(--letra-Staatliches)"],
        sunshine: ["var(--letra-sunshine)"]
      }
    },
  },
  plugins: [],
}
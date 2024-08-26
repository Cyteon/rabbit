/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            marginTop: "0",
            marginBottom: "0",
            color: "#cad3f5",
            a: { color: "#8aadf4" },
            h1: { color: "#cad3f5", marginBottom: "0", lineHeight: "1.2" },
            h2: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            h3: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            h4: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            h5: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            h6: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            em: { color: "#cad3f5", marginBottom: "0", marginTop: "0" },
            ol: { margin: "0", padding: "0" },
            th: { color: "#cad3f5" },
            blockquote: { color: "#cad3f5" },
            code: { color: "#b8c0e0", backgroundColor: "#1e2030" },
            pre: { color: "#cad3f5", backgroundColor: "#1e2030" },
            bold: { color: "#cad3f5" },
            strong: { color: "#cad3f5" },
          },
        },
      }),
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      // prefix to use, e.g. `text-pink` becomes `text-ctp-pink`.
      // default is `false`, which means no prefix
      prefix: "ctp",
      // which flavour of colours to use by default, in the `:root`
      defaultFlavour: "macchiato",
    }),
    require("@tailwindcss/typography"),
  ],
};

/** @type {import('tailwindcss').Config} */
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
  preprocess: vitePreprocess(),
};

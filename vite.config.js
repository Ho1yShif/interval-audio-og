import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from a GitHub Pages project subpath: https://ho1yshif.github.io/interval-audio-og/
  base: "/interval-audio-og/",
  plugins: [react()],
  ssgOptions: {
    formatting: "minify",
  },
});

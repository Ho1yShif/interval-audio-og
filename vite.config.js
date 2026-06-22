import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from a GitHub Pages project subpath: ho1yshif.github.io/interval-audio/
  base: "/interval-audio/",
  plugins: [react()],
  ssgOptions: {
    formatting: "minify",
  },
});

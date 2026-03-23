import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./docs",
  },
  plugins: [vue(), vueJsx()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
      less: {
        modifyVars: {
          "border-radius-small": "0px",
          "border-radius-medium": "0px",
          "border-radius-large": "0px",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 1124,
    open: true,
  },
});

import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Redireciona qualquer requisição que comece com /api...
        "/api": {
          // ...para o seu backend C# que está rodando na porta 5000
          target: "http://localhost:5000",
          // Necessário para o redirecionamento funcionar corretamente
          changeOrigin: true,
          secure: false,
          // Opcional: reescreve a URL se necessário (neste caso não precisa)
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
});

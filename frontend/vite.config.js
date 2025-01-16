import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist", // Build fayllari uchun alohida papka (masalan, dist)
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // API ga proxy qilish
      },
    },
  },
  publicDir: "public", // Statik fayllar uchun public papkasi
});

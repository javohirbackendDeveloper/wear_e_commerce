import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist", // Build fayllari uchun chiqish papkasi
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // API uchun proxy
      },
    },
  },
  publicDir: "public", // Statik fayllar uchun public papkasi
});

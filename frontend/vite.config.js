import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { server } from "typescript";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
      },
    },
  },
});

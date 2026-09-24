import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// React (Vite) frontend for ElectroHub.
// This app ONLY binds to the Spring Boot API — no backend logic here.
export default defineConfig({
  plugins: [react()],

  // IMPORTANT: keep config resolution scoped to THIS folder so Vite never
  // climbs up and loads the root Next.js postcss/tailwind config.
  root: __dirname,

  css: {
    // Point PostCSS explicitly at this folder's config (empty) so Vite does
    // not search parent directories for a postcss.config.
    postcss: __dirname,
  },

  server: {
    port: 5173,
    // Optional dev proxy: lets the frontend call "/api/..." and forwards
    // it to the Spring Boot backend (avoids CORS during development).
    // To use it, set VITE_API_BASE_URL="" in frontend-react/.env
    proxy: {
      "/api": {
        target: "https://taj-electro-hub-be.onrender.com",
        // target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 5173,
  },
});

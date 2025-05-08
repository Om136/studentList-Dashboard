import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ Use relative path for Vercel root deployments
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    open: true,
  },
});

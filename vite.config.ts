import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 3000,
    strictPort: false, // Allow fallback to next available port if 3000 is taken
    open: true, // This will open the browser automatically
  },
});

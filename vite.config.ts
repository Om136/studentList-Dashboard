import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: "es",
        entryFileNames: "assets/[name].[hash].mjs",
        chunkFileNames: "assets/[name].[hash].mjs",
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    open: true,
  },
});

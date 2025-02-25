import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjsWorker: ["pdfjs-dist/build/pdf.worker.min.js"],
        },
      },
    },
  },
});

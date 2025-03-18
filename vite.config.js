import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress",
      threshold: 512,
    }),
    visualizer({ open: true }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  css: {
    postcss: "postcss.config.js",
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("firebase")) return "firebase-vendor";
            if (id.includes("notistack")) return "notistack-vendor";
            if (id.includes("lodash")) return "lodash-vendor";
            if (id.includes("moment")) return "moment-vendor";
            return "vendor";
          }
        },
      },
    },
  },
});

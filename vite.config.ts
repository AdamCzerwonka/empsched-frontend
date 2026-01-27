import { reactRouter } from "@react-router/dev/vite";
import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    serwist({
      swSrc: "sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
      // disable: process.env.NODE_ENV === "development",
    }),
  ],
  server: {
    allowedHosts: ["essayistic-shantay-nonphotographically.ngrok-free.dev"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: [
      "cuneate-aphidious-clement.ngrok-free.dev",
      "essayistic-shantay-nonphotographically.ngrok-free.dev",
    ],
  },
});

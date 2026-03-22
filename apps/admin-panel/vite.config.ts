import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@bawaa/convex-db": path.resolve(__dirname, "../../packages/convex-db"),
    },
  },
  server: {
    host: true,
    port: 4004,
  },
});

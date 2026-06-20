import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const DEFAULT_PORT = Number(process.env.PORT) || 5173;
const DEFAULT_HOST = process.env.HOST ?? "127.0.0.1";

export default defineConfig(({ mode }) => ({
  server: {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    strictPort: Boolean(process.env.PORT),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/components/ui/**", "src/test/**", "src/vite-env.d.ts"],
    },
  },
}));

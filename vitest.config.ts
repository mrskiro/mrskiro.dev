import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    setupFiles: ["./src/test/setup.ts"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
    },
  },
  define: {
    "process.env.__NEXT_ROUTER_BASEPATH": JSON.stringify(""),
  },
});

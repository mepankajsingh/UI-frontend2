import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      serverModuleFormat: "esm",
      // Use the built-in Netlify adapter configuration instead of importing it
      serverBuildPath: "functions/server.js",
    }),
    tsconfigPaths(),
  ],
  // Prevent bundling of problematic modules
  optimizeDeps: {
    exclude: ['@remix-run/dev/adapters']
  },
  // Mark certain imports as external to prevent bundling issues
  ssr: {
    external: ['@remix-run/dev/adapters']
  }
});

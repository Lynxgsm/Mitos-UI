import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    // FSD: the router, its file routes and the generated tree live in the app layer (ARCHITECTURE.md §5)
    tanstackStart({
      router: {
        entry: "app/router.tsx",
        routesDirectory: "app/routes",
        generatedRouteTree: "app/routeTree.gen.ts",
      },
    }),
    // react's vite plugin must come after start's
    viteReact(),
  ],
});

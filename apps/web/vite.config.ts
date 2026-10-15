import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves the site under /<repository>/ (set by .github/workflows/pages.yml); "/" everywhere else
  base: process.env.BASE_PATH ?? "/",
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
      // static HTML for every page reachable from the home page: GitHub Pages has no server
      // fewer parallel renders and retries: under load the local render server can drop a request
      prerender: { enabled: true, crawlLinks: true, concurrency: 4, retryCount: 2 },
    }),
    // react's vite plugin must come after start's
    viteReact(),
  ],
});

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // BASE_URL is the vite base: /Mitos-UI/ on GitHub Pages, / everywhere else
  return createRouter({ routeTree, basepath: import.meta.env.BASE_URL, scrollRestoration: true, defaultViewTransition: true });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

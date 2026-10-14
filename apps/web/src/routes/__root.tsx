import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import omniStylesHref from "@omni/core/react/styles.css?url";
import stylesHref from "../styles.css?url";
import siteStylesHref from "../site/site.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Omni System UI" },
    ],
    links: [
      { rel: "stylesheet", href: omniStylesHref },
      { rel: "stylesheet", href: stylesHref },
      { rel: "stylesheet", href: siteStylesHref },
    ],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

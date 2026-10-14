import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "@omni/core/react";
import omniStylesHref from "@omni/core/react/styles.css?url";
import stylesHref from "../styles.css?url";
import siteStylesHref from "../site/site.css?url";
import { SITE_THEME_CSS, THEME_INIT_SCRIPT } from "../site/theme";

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
    // data-theme is set by the init script before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
        {/* after the library stylesheet, so the site-theme layer is ordered above the library's layers */}
        <style>{SITE_THEME_CSS}</style>
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

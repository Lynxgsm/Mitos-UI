import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "mitos-ui/react";
import mitosStylesHref from "mitos-ui/react/styles.css?url";
import baseStylesHref from "../styles/base.css?url";
import siteStylesHref from "../styles/site.css?url";
import { SITE_THEME_CSS } from "../styles/site-theme";
import { siteHeaderStylesHref } from "@/widgets/site-header";
import { COLOR_SCHEME_INIT_SCRIPT, themeToggleStylesHref } from "@/features/toggle-color-scheme";
import { frameworkLogoStylesHref } from "@/entities/framework";
import { codeBlockStylesHref } from "@/shared/ui/code-block";
import { optionGroupStylesHref } from "@/shared/ui/option-group";
import { propsTableStylesHref } from "@/shared/ui/props-table";
import { tabsStylesHref } from "@/shared/ui/tabs";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mitos UI" },
    ],
    links: [
      { rel: "stylesheet", href: mitosStylesHref },
      { rel: "stylesheet", href: baseStylesHref },
      { rel: "stylesheet", href: siteStylesHref },
      // UI used on every page (header, shared and entity components): linked once here
      ...[siteHeaderStylesHref, themeToggleStylesHref, frameworkLogoStylesHref, codeBlockStylesHref, tabsStylesHref, propsTableStylesHref, optionGroupStylesHref].map((href) => ({
        rel: "stylesheet",
        href,
      })),
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
        <script dangerouslySetInnerHTML={{ __html: COLOR_SCHEME_INIT_SCRIPT }} />
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

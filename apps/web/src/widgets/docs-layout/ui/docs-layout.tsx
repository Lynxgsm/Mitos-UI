import type { ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { SideNav } from "@omni/core/react";
import { DOCS_NAV, type DocsHref } from "../model/nav";

// the library SideNav, wired to the router: plain clicks navigate client-side, new-tab clicks stay links
function SidebarNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <SideNav
      label="Docs"
      currentHref={pathname.replace(/\/$/, "") || "/docs"}
      groups={DOCS_NAV.map((group) => ({
        title: group.title,
        items: group.items.map((item) => ({ label: item.title, href: item.href })),
      }))}
      onNavigate={(href) => navigate({ to: href as DocsHref })}
    />
  );
}

// the header comes in as a slot: a widget cannot import another widget (ARCHITECTURE.md §2)
export function DocsLayout(props: { header: ReactNode }) {
  return (
    <div className="docs">
      {props.header}
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <SidebarNav />
        </aside>
        <details className="docs-mobile-nav">
          <summary>Menu</summary>
          <SidebarNav />
        </details>
        <main id="content" className="docs-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

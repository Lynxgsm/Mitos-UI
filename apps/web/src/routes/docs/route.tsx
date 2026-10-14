import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { DOCS_NAV } from "../../docs/nav";
import { SiteHeader } from "../../site/site-header";
import docsStylesHref from "../../docs/docs.css?url";

export const Route = createFileRoute("/docs")({
  head: () => ({ links: [{ rel: "stylesheet", href: docsStylesHref }] }),
  component: DocsLayout,
});

function SidebarNav() {
  return (
    <nav aria-label="Docs" className="docs-nav">
      {DOCS_NAV.map((group) => (
        <div key={group.title} className="docs-nav-group">
          <p className="docs-nav-title">{group.title}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.href}>
                <Link to={item.href} activeOptions={{ exact: true }}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function DocsLayout() {
  return (
    <div className="docs">
      <SiteHeader />
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

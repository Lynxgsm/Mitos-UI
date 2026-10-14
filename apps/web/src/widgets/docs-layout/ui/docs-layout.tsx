import type { ReactNode } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { DOCS_NAV } from "../model/nav";

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

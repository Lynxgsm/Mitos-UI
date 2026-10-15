import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "mitos-ui/react";
import { ThemeToggle } from "@/features/toggle-color-scheme";

const LINKS = [
  { section: "docs", label: "Docs", to: "/docs" },
  { section: "components", label: "Components", to: "/docs/components/button" },
  { section: "blocks", label: "Blocks", to: "/blocks" },
  { section: "theming", label: "Theming", to: "/docs/theming" },
  { section: "create", label: "Create", to: "/create" },
] as const;

function currentSection(pathname: string) {
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/blocks")) return "blocks";
  if (pathname.startsWith("/docs/components")) return "components";
  if (pathname.startsWith("/docs/theming")) return "theming";
  if (pathname.startsWith("/docs")) return "docs";
  return null;
}

// Shared by every page: same size and content everywhere (width is fixed in site-header.css).
// On small screens the links move into a menu opened by the burger button (disclosure pattern);
// `menu` adds the navigation of the current section to it (the docs pass their sidebar).
export function SiteHeader(props: { menu?: ReactNode }) {
  const { pathname } = useLocation();
  const section = currentSection(pathname);
  const [open, setOpen] = useState(false);

  // following a link closes the menu
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <a href="#content" className="site-skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="site-logo">
          Mitos UI
        </Link>
        <nav aria-label="Main">
          <ul>
            {LINKS.map((link) => (
              <li key={link.section}>
                {/* exact: aria-current="page" only on the page itself; data-active highlights the section */}
                <Link to={link.to} activeOptions={{ exact: true }} data-active={section === link.section || undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header-actions">
          <ThemeToggle />
          <Link to="/docs/installation" className="site-button site-button-small site-header-cta">
            Get started
          </Link>
          <Button
            id="site-menu-toggle"
            variant="ghost"
            size="sm"
            class="site-icon-button site-menu-toggle"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            {/* three bars that morph into a cross while open (site-header.css) */}
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" className="site-menu-icon">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </Button>
        </div>
        <div
          id="site-menu"
          className="site-menu"
          hidden={!open}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            document.getElementById("site-menu-toggle")?.focus();
          }}
        >
          <nav aria-label="Menu">
            <ul>
              {LINKS.map((link) => (
                <li key={link.section}>
                  <Link to={link.to} activeOptions={{ exact: true }} data-active={section === link.section || undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {props.menu}
        </div>
      </header>
    </>
  );
}

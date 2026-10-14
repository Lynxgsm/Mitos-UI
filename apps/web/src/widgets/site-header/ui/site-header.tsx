import { Link, useLocation } from "@tanstack/react-router";
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
export function SiteHeader() {
  const section = currentSection(useLocation().pathname);
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
        </div>
      </header>
    </>
  );
}

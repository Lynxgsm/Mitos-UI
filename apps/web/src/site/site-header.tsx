import { Link, useLocation } from "@tanstack/react-router";

const LINKS = [
  { section: "docs", label: "Docs", to: "/docs" },
  { section: "components", label: "Components", to: "/docs/components/accordion" },
  { section: "theming", label: "Theming", to: "/docs/theming" },
] as const;

function currentSection(pathname: string) {
  if (pathname.startsWith("/docs/components")) return "components";
  if (pathname.startsWith("/docs/theming")) return "theming";
  if (pathname.startsWith("/docs")) return "docs";
  return null;
}

// Shared by the landing page and the docs: one header, aligned to each page's --site-width.
export function SiteHeader() {
  const section = currentSection(useLocation().pathname);
  return (
    <>
      <a href="#content" className="site-skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="site-logo">
          Omni UI
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
        <Link to="/docs/installation" className="site-button site-button-small site-header-cta">
          Get started
        </Link>
      </header>
    </>
  );
}

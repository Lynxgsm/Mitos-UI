import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@omni/core/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { THEME_STORAGE_KEY } from "./theme";

const LINKS = [
  { section: "docs", label: "Docs", to: "/docs" },
  { section: "components", label: "Components", to: "/docs/components/accordion" },
  { section: "theming", label: "Theming", to: "/docs/theming" },
  { section: "create", label: "Create", to: "/create" },
] as const;

function currentSection(pathname: string) {
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/docs/components")) return "components";
  if (pathname.startsWith("/docs/theming")) return "theming";
  if (pathname.startsWith("/docs")) return "docs";
  return null;
}

// Toggle button (WAI-ARIA): fixed label, state in aria-pressed. The choice overrides the system scheme.
function ThemeToggle() {
  // the server can't know the stored choice: sync after mount to keep hydration consistent
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const forced = document.documentElement.dataset.theme;
    setDark(forced ? forced === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  function toggle() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage can be blocked (private mode, policies): the toggle still works for this page
    }
    setDark(!dark);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      class="site-icon-button site-theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={toggle}
    >
      {dark ? <SunIcon aria-hidden="true" size={18} /> : <MoonIcon aria-hidden="true" size={18} />}
    </Button>
  );
}

// Shared by every page: same size and content everywhere (width is fixed in site.css).
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

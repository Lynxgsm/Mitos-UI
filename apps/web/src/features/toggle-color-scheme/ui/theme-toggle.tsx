import { useEffect, useState } from "react";
import { Button } from "mitos-ui/react";
import { COLOR_SCHEME_STORAGE_KEY } from "../model/color-scheme";

// Toggle button (WAI-ARIA): fixed label, state in aria-pressed. The choice overrides the system scheme.
export function ThemeToggle() {
  // the server can't know the stored choice: sync after mount to keep hydration consistent
  const [dark, setDark] = useState(false);
  // the icon only animates after a click: syncing the stored choice on load must not play the morph
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const forced = document.documentElement.dataset.theme;
    setDark(forced ? forced === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  function toggle() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, theme);
    } catch {
      // storage can be blocked (private mode, policies): the toggle still works for this page
    }
    setAnimate(true);
    setDark(!dark);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      class="site-icon-button theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      data-animate={animate || undefined}
      onClick={toggle}
    >
      {/* a moon (a disc with a sliding cutout) that morphs into a sun while dark mode is on (theme-toggle.css);
          one toggle per page, so the mask id is fixed */}
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="theme-icon">
        <mask id="theme-icon-cutout">
          <rect width="24" height="24" fill="white" />
          <circle className="theme-icon-cutout" cx="17" cy="7" r="7" fill="black" />
        </mask>
        <circle className="theme-icon-body" cx="12" cy="12" r="8" fill="currentColor" mask="url(#theme-icon-cutout)" />
        <g className="theme-icon-rays">
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </g>
      </svg>
    </Button>
  );
}

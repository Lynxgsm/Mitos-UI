import { useEffect, useState } from "react";
import { Button } from "@omni/core/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { COLOR_SCHEME_STORAGE_KEY } from "../model/color-scheme";

// Toggle button (WAI-ARIA): fixed label, state in aria-pressed. The choice overrides the system scheme.
export function ThemeToggle() {
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
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, theme);
    } catch {
      // storage can be blocked (private mode, policies): the toggle still works for this page
    }
    setDark(!dark);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      class="site-icon-button theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={toggle}
    >
      {dark ? <SunIcon aria-hidden="true" size={18} /> : <MoonIcon aria-hidden="true" size={18} />}
    </Button>
  );
}

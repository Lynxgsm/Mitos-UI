import { For, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <nav>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "groups", "currentHref", "onNavigate", "class",
];

export type SideNavItem = { label: string; href: string };
export type SideNavGroup = { title?: string; items: SideNavItem[] };

export type SideNavProps = {
  // names the navigation landmark, e.g. Docs or Settings
  label: string;
  groups: SideNavGroup[];
  // href of the current page: its link gets aria-current
  currentHref?: string;
  // client-side routing: called instead of following the link on a plain click
  onNavigate?: (href: string, event: any) => void;
  class?: string;
  // native attributes below are forwarded as-is to the <nav>
  id?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  nav: { display: "grid", gap: "1.5rem", fontSize: "0.875rem" },
  title: {
    margin: 0,
    marginBottom: "0.5rem",
    paddingInline: "0.5rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: colors["--mitos-muted-foreground"],
  },
  list: { display: "grid", gap: "0.125rem", margin: 0, padding: 0, listStyle: "none" },
  link: {
    display: "flex",
    alignItems: "center",
    minHeight: "2rem",
    paddingInline: "0.5rem",
    borderRadius: radii["--mitos-radius-sm"],
    color: { default: colors["--mitos-muted-foreground"], ":hover": colors["--mitos-foreground"] },
    textDecoration: "none",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors["--mitos-ring"],
  },
  // the current page is marked by a bar and a weight as well as by its colors (WCAG 1.4.1)
  current: {
    color: { default: colors["--mitos-accent-foreground"], ":hover": colors["--mitos-accent-foreground"] },
    backgroundColor: colors["--mitos-accent"],
    boxShadow: `inset 2px 0 0 ${colors["--mitos-primary"]}`,
    fontWeight: 500,
  },
});

export default function SideNav(props: SideNavProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    // new tab, new window and download clicks keep the browser behavior
    follow(href: string, event: any) {
      if (!props.onNavigate) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      props.onNavigate(href, event);
    },
  });

  return (
    <nav {...state.attributes} aria-label={props.label} class={clsx(stylex.props(styles.nav).className, props.class)}>
      <For each={props.groups}>
        {(group, index) => (
          <div key={group.title ?? index}>
            {group.title && (
              // the list below carries the title as its name; this visible copy is not read twice
              <p aria-hidden="true" class={stylex.props(styles.title).className}>
                {group.title}
              </p>
            )}
            <ul aria-label={group.title} class={stylex.props(styles.list).className}>
              <For each={group.items}>
                {(item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={item.href === props.currentHref ? "page" : undefined}
                      class={stylex.props(styles.link, item.href === props.currentHref && styles.current).className}
                      onClick={(event) => state.follow(item.href, event)}
                    >
                      {item.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </div>
        )}
      </For>
    </nav>
  );
}

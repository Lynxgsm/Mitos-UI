import { For, onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the trigger <button>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "items", "align", "id", "class",
];

export type MenuItem = { label: string; onSelect: () => void; disabled?: boolean };

export type MenuProps = {
  // text of the trigger button, also the name of the menu
  label: any;
  // actions only: for navigation, use a list of links
  items: MenuItem[];
  align?: "start" | "end";
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the trigger <button>
  disabled?: boolean;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// space kept between the menu and the button, and between the menu and the edges of the viewport
const GAP = 4;
const MARGIN = 8;

const styles = stylex.create({
  root: { position: "relative", display: "inline-flex" },
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    height: "2.25rem",
    paddingInline: "1rem",
    font: "inherit",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: { default: colors["--omni-foreground"], ":hover": colors["--omni-accent-foreground"] },
    backgroundColor: { default: colors["--omni-background"], ":hover": colors["--omni-accent"] },
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--omni-border"],
    borderRadius: radii["--omni-radius-md"],
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
  },
  chevron: { width: "1rem", height: "1rem", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
  menu: {
    position: "absolute",
    zIndex: 50,
    minWidth: "max(100%, 10rem)",
    padding: "0.25rem",
    boxSizing: "border-box",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--omni-border"],
    borderRadius: radii["--omni-radius-md"],
    backgroundColor: colors["--omni-background"],
    boxShadow: `0 8px 24px -8px ${colors["--omni-overlay"]}`,
  },
  // only while open: a display value would override the hidden attribute and keep the closed menu on screen
  open: { display: "grid" },
  below: { top: "calc(100% + 0.25rem)" },
  above: { bottom: "calc(100% + 0.25rem)" },
  // shortcut: start and end are measured as left and right, so a right-to-left page gets the sides swapped;
  // compare with the inline direction if RTL support is added
  start: { insetInlineStart: 0 },
  end: { insetInlineEnd: 0 },
  item: {
    display: "flex",
    alignItems: "center",
    minHeight: "2rem",
    paddingInline: "0.5rem",
    font: "inherit",
    fontSize: "0.875rem",
    textAlign: "start",
    color: { default: colors["--omni-foreground"], ":focus": colors["--omni-accent-foreground"] },
    backgroundColor: { default: "transparent", ":focus": colors["--omni-accent"] },
    borderStyle: "none",
    borderRadius: radii["--omni-radius-sm"],
    cursor: "pointer",
    // the focused item is highlighted, and keyboard focus also gets the ring (WCAG 2.4.7)
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors["--omni-ring"],
  },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
});

export default function Menu(props: MenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const state = useStore({
    open: false,
    // where it opens: below and on the preferred side, flipped when it does not fit; hidden until measured
    above: false,
    alignment: props.align ?? "start",
    placed: false,
    // item to focus once the menu is placed and visible: browsers do not focus hidden elements
    pendingFocus: "",
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    partId(part: string) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}` : undefined;
    },
    get menuItems() {
      return (rootRef ? Array.from(rootRef.querySelectorAll("[role=menuitem]")) : []) as HTMLElement[];
    },
    get positionStyle() {
      return { visibility: state.placed ? undefined : "hidden" } as any;
    },
    // flips above when there is no room below, and to the other edge of the button when it overflows sideways
    place() {
      const list = menuRef;
      if (!list || !rootRef) return;
      const anchor = rootRef.getBoundingClientRect();
      const listHeight = list.offsetHeight;
      const listWidth = list.offsetWidth;
      const fitsBelow = anchor.bottom + GAP + listHeight <= window.innerHeight - MARGIN;
      const fitsAbove = anchor.top - GAP - listHeight >= MARGIN;
      state.above = !fitsBelow && fitsAbove;
      const fitsStart = anchor.left + listWidth <= window.innerWidth - MARGIN;
      const fitsEnd = anchor.right - listWidth >= MARGIN;
      if ((props.align ?? "start") === "start") state.alignment = fitsStart || !fitsEnd ? "start" : "end";
      else state.alignment = fitsEnd || !fitsStart ? "end" : "start";
      state.placed = true;
    },
    // opens, places the menu once rendered, then focuses an item (see the onUpdate below)
    openAt(position: "first" | "last") {
      state.pendingFocus = position;
      state.placed = false;
      state.open = true;
      requestAnimationFrame(() => state.place());
    },
    close(restoreFocus: boolean) {
      state.open = false;
      if (restoreFocus) (rootRef?.querySelector("[aria-haspopup=menu]") as HTMLElement | null)?.focus();
    },
    onTriggerKeyDown(event: any) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.openAt("first");
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        state.openAt("last");
      }
    },
    // APG menu: arrows wrap, Home and End, typing a letter jumps to the next item starting with it
    onMenuKeyDown(event: any) {
      const entries = state.menuItems;
      const position = entries.indexOf(event.target);
      const last = entries.length - 1;
      let next = -1;
      if (event.key === "ArrowDown") next = position === last ? 0 : position + 1;
      else if (event.key === "ArrowUp") next = position <= 0 ? last : position - 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = last;
      else if (event.key === "Escape") {
        event.preventDefault();
        state.close(true);
        return;
      } else if (event.key === "Tab") {
        state.close(false);
        return;
      } else if (event.key.length === 1 && /\S/.test(event.key)) {
        const letter = event.key.toLowerCase();
        const order = [...entries.slice(position + 1), ...entries.slice(0, position + 1)];
        const match = order.find((entry) => (entry.textContent ?? "").trim().toLowerCase().startsWith(letter));
        next = match ? entries.indexOf(match) : -1;
      }
      if (next < 0) return;
      event.preventDefault();
      entries[next]?.focus();
    },
    // the pointer moves the focus, like the arrows: one highlighted item at a time, and the keys go on from it
    hover(item: MenuItem, event: any) {
      if (!item.disabled) event.currentTarget.focus();
    },
    choose(item: MenuItem) {
      if (item.disabled) return;
      state.close(true);
      item.onSelect();
    },
    // focus leaving the whole menu button (click elsewhere, Tab) closes the menu
    onFocusOut(event: any) {
      if (state.open && !rootRef?.contains(event.relatedTarget)) state.close(false);
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `omni-menu-${Math.random().toString(36).slice(2, 10)}`;
  });

  // runs after the render that shows the placed menu, so the item can take the focus
  onUpdate(() => {
    if (!state.placed || !state.pendingFocus) return;
    const entries = state.menuItems;
    entries[state.pendingFocus === "first" ? 0 : entries.length - 1]?.focus();
    state.pendingFocus = "";
  }, [state.placed]);

  return (
    <div
      ref={rootRef}
      class={clsx(stylex.props(styles.root).className, props.class)}
      onBlur={(event) => state.onFocusOut(event)}
    >
      <button
        {...state.attributes}
        type="button"
        id={state.partId("trigger")}
        aria-haspopup="menu"
        aria-expanded={state.open}
        aria-controls={state.partId("menu")}
        class={stylex.props(styles.trigger).className}
        onClick={() => (state.open ? state.close(false) : state.openAt("first"))}
        onKeyDown={(event) => state.onTriggerKeyDown(event)}
      >
        {props.label}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={stylex.props(styles.chevron).className}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        ref={menuRef}
        role="menu"
        id={state.partId("menu")}
        tabIndex={-1}
        aria-labelledby={state.partId("trigger")}
        hidden={!state.open}
        data-side={state.above ? "top" : "bottom"}
        data-align={state.alignment}
        style={state.positionStyle}
        class={stylex.props(
          styles.menu,
          state.open && styles.open,
          state.above ? styles.above : styles.below,
          state.alignment === "end" ? styles.end : styles.start,
        ).className}
        onKeyDown={(event) => state.onMenuKeyDown(event)}
      >
        <For each={props.items}>
          {(item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              aria-disabled={item.disabled ? true : undefined}
              class={stylex.props(styles.item, item.disabled && styles.disabled).className}
              onClick={() => state.choose(item)}
              onMouseEnter={(event) => state.hover(item, event)}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

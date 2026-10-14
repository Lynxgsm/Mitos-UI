import { For, onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the root <div>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "items", "label", "value", "defaultValue", "onValueChange", "orientation", "id", "class",
];

export type TabItem = { value: string; label: any; content: any; disabled?: boolean };

export type TabsProps = {
  items: TabItem[];
  // names the tab list for screen readers
  label: string;
  // controlled selection: update it from onValueChange
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the root <div>
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const NEXT_KEYS = { horizontal: "ArrowRight", vertical: "ArrowDown" };
const PREVIOUS_KEYS = { horizontal: "ArrowLeft", vertical: "ArrowUp" };

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: "1rem" },
  rootVertical: { flexDirection: "row", alignItems: "flex-start" },
  list: {
    display: "flex",
    gap: "0.25rem",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors["--mitos-border"],
  },
  listVertical: {
    flexDirection: "column",
    borderBottomWidth: 0,
    borderInlineEndWidth: 1,
    borderInlineEndStyle: "solid",
    borderInlineEndColor: colors["--mitos-border"],
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "2.25rem",
    paddingInline: "0.75rem",
    marginBottom: "-1px",
    font: "inherit",
    fontSize: "0.875rem",
    fontWeight: 500,
    // muted-foreground on the page reaches 4.5:1; the selected tab gets the full foreground and an underline
    color: colors["--mitos-muted-foreground"],
    backgroundColor: "transparent",
    borderStyle: "none",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    borderRadius: `${radii["--mitos-radius-sm"]} ${radii["--mitos-radius-sm"]} 0 0`,
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors["--mitos-ring"],
  },
  tabVertical: {
    justifyContent: "flex-start",
    marginBottom: 0,
    marginInlineEnd: "-1px",
    borderBottomWidth: 0,
    borderInlineEndWidth: 2,
    borderInlineEndStyle: "solid",
    borderInlineEndColor: "transparent",
    borderRadius: `${radii["--mitos-radius-sm"]} 0 0 ${radii["--mitos-radius-sm"]}`,
  },
  // the selected state is also carried by the underline, not only by the text color (WCAG 1.4.1)
  selected: {
    color: colors["--mitos-foreground"],
    borderBottomColor: colors["--mitos-primary"],
  },
  selectedVertical: {
    color: colors["--mitos-foreground"],
    borderInlineEndColor: colors["--mitos-primary"],
  },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
  panel: {
    minWidth: 0,
    flexGrow: 1,
    fontSize: "0.875rem",
    color: colors["--mitos-foreground"],
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
    borderRadius: radii["--mitos-radius-sm"],
  },
});

export default function Tabs(props: TabsProps) {
  const state = useStore({
    // uncontrolled selection, the first enabled tab by default
    current: props.defaultValue ?? props.items.find((item) => !item.disabled)?.value ?? "",
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    get selected() {
      return props.value ?? state.current;
    },
    get vertical() {
      return props.orientation === "vertical";
    },
    partId(part: string, index: number) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}-${index}` : undefined;
    },
    select(item: TabItem) {
      if (item.disabled) return;
      state.current = item.value;
      props.onValueChange?.(item.value);
    },
    // APG tabs with automatic activation: the arrows move the focus and select; disabled tabs get the focus only
    navigate(event: any) {
      const direction = props.orientation === "vertical" ? "vertical" : "horizontal";
      const keys = ["Home", "End", NEXT_KEYS[direction], PREVIOUS_KEYS[direction]];
      if (!keys.includes(event.key)) return;
      const tabs: HTMLElement[] = Array.from(event.currentTarget.querySelectorAll(":scope > [role=tab]"));
      const position = tabs.indexOf(event.target);
      const last = tabs.length - 1;
      const next =
        event.key === "Home" ? 0
        : event.key === "End" ? last
        : event.key === NEXT_KEYS[direction] ? (position === last ? 0 : position + 1)
        : position === 0 ? last : position - 1;
      event.preventDefault();
      tabs[next]?.focus();
      state.select(props.items[next]!);
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-tabs-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div
      {...state.attributes}
      id={props.id}
      class={clsx(stylex.props(styles.root, state.vertical && styles.rootVertical).className, props.class)}
    >
      <div
        role="tablist"
        tabIndex={-1}
        aria-label={props.label}
        aria-orientation={state.vertical ? "vertical" : undefined}
        class={stylex.props(styles.list, state.vertical && styles.listVertical).className}
        onKeyDown={(event) => state.navigate(event)}
      >
        <For each={props.items}>
          {(item, index) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={state.partId("tab", index)}
              aria-selected={item.value === state.selected}
              aria-controls={state.partId("panel", index)}
              aria-disabled={item.disabled ? true : undefined}
              tabIndex={item.value === state.selected ? 0 : -1}
              class={stylex.props(
                styles.tab,
                state.vertical && styles.tabVertical,
                item.value === state.selected && (state.vertical ? styles.selectedVertical : styles.selected),
                item.disabled && styles.disabled,
              ).className}
              onClick={() => state.select(item)}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
      <For each={props.items}>
        {(item, index) => (
          <div
            key={item.value}
            role="tabpanel"
            id={state.partId("panel", index)}
            aria-labelledby={state.partId("tab", index)}
            hidden={item.value !== state.selected}
            tabIndex={0}
            class={stylex.props(styles.panel).className}
          >
            {item.content}
          </div>
        )}
      </For>
    </div>
  );
}

import { For, onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <dl>.
  // shortcut: iterating props only compiles correctly for React; Vue/Svelte targets will need
  // their native fallthrough ($attrs / $$restProps) when added.
  "items", "multiple", "defaultOpen", "id", "class",
];

const NAVIGATION_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export type AccordionItem = {
  title: any;
  content: any;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
  id?: string;
  class?: string;
  title?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const DURATION = { default: "300ms", "@media (prefers-reduced-motion: reduce)": "0s" };
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

// panel: animating grid rows 0fr -> 1fr reaches the content's natural height without measuring it in JS.
// visibility flips at the end of the close transition, so collapsed text can't be found or selected.
const styles = stylex.create({
  root: { margin: 0 },
  item: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors["--omni-border"],
  },
  term: { margin: 0 },
  trigger: {
    display: "flex",
    width: "100%",
    minHeight: "2.75rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBlock: "1rem",
    paddingInline: 0,
    font: "inherit",
    fontWeight: 500,
    textAlign: "start",
    color: colors["--omni-foreground"],
    backgroundColor: "transparent",
    borderStyle: "none",
    cursor: "pointer",
    textDecorationLine: { default: "none", ":hover": "underline" },
    textUnderlineOffset: 4,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
    pointerEvents: { default: null, ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
  chevron: {
    flexShrink: 0,
    width: "1rem",
    height: "1rem",
    color: colors["--omni-muted-foreground"],
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    transitionProperty: "transform",
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
  },
  chevronOpen: { transform: "rotate(180deg)" },
  panel: {
    display: "grid",
    gridTemplateRows: "0fr",
    margin: 0,
    opacity: 0,
    visibility: "hidden",
    transitionProperty: "grid-template-rows, opacity, visibility",
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
  },
  panelOpen: { gridTemplateRows: "1fr", opacity: 1, visibility: "visible" },
  panelInner: { overflow: "hidden", minHeight: 0 },
  content: {
    paddingBottom: "1rem",
    transform: "translateY(-0.5rem)",
    transitionProperty: "transform",
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
  },
  contentOpen: { transform: "translateY(0)" },
});

export default function Accordion(props: AccordionProps) {
  const state = useStore({
    openItems: props.defaultOpen ?? ([] as number[]),
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    isOpen(index: number) {
      return state.openItems.includes(index);
    },
    toggle(index: number) {
      if (state.isOpen(index)) {
        state.openItems = state.openItems.filter((i) => i !== index);
      } else {
        state.openItems = props.multiple ? [...state.openItems, index] : [index];
      }
    },
    partId(part: string, index: number) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}-${index}` : undefined;
    },
    // APG accordion (optional keys): move focus between enabled headers of this accordion only
    navigate(event: any) {
      if (!NAVIGATION_KEYS.includes(event.key)) return;
      const triggers: HTMLButtonElement[] = Array.from(
        event.currentTarget.closest("dl").querySelectorAll(":scope > div > dt > button:not(:disabled)"),
      );
      const current = triggers.indexOf(event.currentTarget);
      const last = triggers.length - 1;
      const next =
        event.key === "Home" ? 0
        : event.key === "End" ? last
        : event.key === "ArrowDown" ? (current === last ? 0 : current + 1)
        : current === 0 ? last : current - 1;
      event.preventDefault();
      triggers[next]?.focus();
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `omni-accordion-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <dl {...state.attributes} id={props.id} class={clsx(stylex.props(styles.root).className, props.class)}>
      <For each={props.items}>
        {(item, index) => (
          <div key={index} class={stylex.props(styles.item).className}>
            <dt class={stylex.props(styles.term).className}>
              <button
                type="button"
                id={state.partId("trigger", index)}
                aria-expanded={state.isOpen(index)}
                aria-controls={state.partId("panel", index)}
                disabled={item.disabled}
                onClick={() => state.toggle(index)}
                onKeyDown={(event) => state.navigate(event)}
                class={stylex.props(styles.trigger).className}
              >
                <span>{item.title}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class={stylex.props(styles.chevron, state.isOpen(index) && styles.chevronOpen).className}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </dt>
            <dd
              id={state.partId("panel", index)}
              inert={!state.isOpen(index)}
              class={stylex.props(styles.panel, state.isOpen(index) && styles.panelOpen).className}
            >
              <div class={stylex.props(styles.panelInner).className}>
                <div class={stylex.props(styles.content, state.isOpen(index) && styles.contentOpen).className}>
                  {item.content}
                </div>
              </div>
            </dd>
          </div>
        )}
      </For>
    </dl>
  );
}

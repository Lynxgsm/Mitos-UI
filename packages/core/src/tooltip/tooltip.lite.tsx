import { onMount, onUnMount, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the wrapping <span>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "content", "side", "id", "class",
];

export type TooltipProps = {
  // the trigger: one focusable element, e.g. a Button
  children?: any;
  // short text describing the trigger; never interactive content
  content: string;
  side?: "top" | "bottom";
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the wrapping <span>
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// delay before opening on hover, so the tooltip does not flash while the pointer crosses the page
const OPEN_DELAY = 300;
// delay before closing on leave, so the pointer can cross the gap and rest on the tooltip (WCAG 1.4.13)
const CLOSE_DELAY = 100;
const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
// space kept between the tooltip and the trigger, and between the tooltip and the edges of the viewport
const GAP = 6;
const MARGIN = 8;

const styles = stylex.create({
  root: { position: "relative", display: "inline-flex" },
  tooltip: {
    position: "absolute",
    insetInlineStart: "50%",
    zIndex: 50,
    width: "max-content",
    maxWidth: "16rem",
    paddingBlock: "0.375rem",
    paddingInline: "0.625rem",
    borderRadius: radii["--omni-radius-md"],
    // inverted colors: the foreground and background pair reaches 4.5:1 in both color schemes
    backgroundColor: colors["--omni-foreground"],
    color: colors["--omni-background"],
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    textAlign: "center",
    // centered on the trigger, then shifted to stay inside the viewport (set when it opens)
    transform: "translateX(calc(-50% + var(--omni-tooltip-shift, 0px)))",
  },
  top: { bottom: "calc(100% + 0.375rem)" },
  bottom: { top: "calc(100% + 0.375rem)" },
});

export default function Tooltip(props: TooltipProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  let timerRef = useRef<any>(null);
  let removeKeyListenerRef = useRef<() => void>(null);

  const state = useStore({
    open: false,
    // where it is shown: the preferred side, flipped when it does not fit; hidden until measured
    placement: props.side ?? "top",
    shift: 0,
    placed: false,
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    get tooltipId() {
      return props.id ?? state.generatedId;
    },
    get positionStyle() {
      return { "--omni-tooltip-shift": `${state.shift}px`, visibility: state.placed ? undefined : "hidden" } as any;
    },
    show(delay: number) {
      clearTimeout(timerRef);
      timerRef = setTimeout(() => {
        if (state.open) return;
        state.placed = false;
        state.open = true;
        // measured once rendered: the size of the tooltip is only known when it is displayed
        requestAnimationFrame(() => state.place());
      }, delay);
    },
    // flips to the other side when the preferred one lacks room, and shifts sideways to stay in the viewport
    place() {
      const tip = tooltipRef;
      if (!tip || !rootRef) return;
      const anchor = rootRef.getBoundingClientRect();
      const tipHeight = tip.offsetHeight;
      const tipWidth = tip.offsetWidth;
      const fitsAbove = anchor.top - GAP - tipHeight >= MARGIN;
      const fitsBelow = anchor.bottom + GAP + tipHeight <= window.innerHeight - MARGIN;
      if ((props.side ?? "top") === "top") state.placement = fitsAbove || !fitsBelow ? "top" : "bottom";
      else state.placement = fitsBelow || !fitsAbove ? "bottom" : "top";
      const centered = anchor.left + anchor.width / 2 - tipWidth / 2;
      const inside = Math.min(Math.max(centered, MARGIN), window.innerWidth - MARGIN - tipWidth);
      state.shift = Math.round(inside - centered);
      state.placed = true;
    },
    hide(delay: number) {
      clearTimeout(timerRef);
      timerRef = setTimeout(() => (state.open = false), delay);
    },
  });

  onMount(() => {
    // computed here: the state update is not visible yet within this hook
    const describedId = props.id ?? `omni-tooltip-${Math.random().toString(36).slice(2, 10)}`;
    if (!props.id) state.generatedId = describedId;
    // the trigger is a child given by the consumer: describe it once the tooltip id exists
    rootRef?.querySelector(FOCUSABLE)?.setAttribute("aria-describedby", describedId);
    // Escape closes the tooltip wherever the focus is, without moving it (WCAG 1.4.13)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") state.hide(0);
    };
    document.addEventListener("keydown", onKeyDown);
    removeKeyListenerRef = () => document.removeEventListener("keydown", onKeyDown);
  });

  onUnMount(() => {
    clearTimeout(timerRef);
    removeKeyListenerRef?.();
  });

  return (
    <span
      {...state.attributes}
      ref={rootRef}
      class={clsx(stylex.props(styles.root).className, props.class)}
      onMouseEnter={() => state.show(OPEN_DELAY)}
      onMouseLeave={() => state.hide(CLOSE_DELAY)}
      onFocus={() => state.show(0)}
      onBlur={() => state.hide(0)}
    >
      {props.children}
      <span
        ref={tooltipRef}
        role="tooltip"
        id={state.tooltipId || undefined}
        hidden={!state.open}
        data-side={state.placement}
        style={state.positionStyle}
        class={stylex.props(styles.tooltip, state.placement === "bottom" ? styles.bottom : styles.top).className}
      >
        {props.content}
      </span>
    </span>
  );
}

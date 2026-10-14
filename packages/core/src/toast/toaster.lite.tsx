import { For, onMount, onUnMount, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { dismissToast, pauseToasts, resumeToasts, subscribeToasts } from "@/toast/toast-store";
import type { Toast } from "@/toast/toast-store";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <section>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "class",
];

// Mitosis drops `[] as Toast[]` casts in state initializers: a typed constant keeps the type (never mutated)
const NO_TOASTS: Toast[] = [];

export type ToasterProps = {
  label?: string;
  class?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const enter = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(0.75rem)" },
  to: { opacity: 1, transform: "none" },
});

const styles = stylex.create({
  region: {
    position: "fixed",
    insetInlineEnd: "1rem",
    insetBlockEnd: "1rem",
    zIndex: 100,
    width: "min(24rem, calc(100vw - 2rem))",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  toast: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "1rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--omni-border"],
    borderRadius: radii["--omni-radius-lg"],
    backgroundColor: colors["--omni-background"],
    color: colors["--omni-foreground"],
    boxShadow: `0 12px 32px -12px ${colors["--omni-overlay"]}`,
    animationName: { default: enter, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "250ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  destructive: {
    borderColor: colors["--omni-destructive"],
    backgroundColor: colors["--omni-destructive"],
    color: colors["--omni-destructive-foreground"],
  },
  content: { flexGrow: 1, minWidth: 0 },
  title: { margin: 0, fontSize: "0.875rem", fontWeight: 600 },
  description: { margin: "0.25rem 0 0", fontSize: "0.875rem" },
  action: {
    flexShrink: 0,
    minHeight: "2rem",
    paddingInline: "0.75rem",
    font: "inherit",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "inherit",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "currentColor",
    borderRadius: radii["--omni-radius-md"],
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
  },
  dismiss: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "1.75rem",
    height: "1.75rem",
    marginTop: "-0.25rem",
    marginRight: "-0.25rem",
    padding: 0,
    borderStyle: "none",
    borderRadius: radii["--omni-radius-sm"],
    // full opacity: the icon keeps 3:1 against the toast, including on destructive
    backgroundColor: { default: "transparent", ":hover": "color-mix(in oklab, currentColor 15%, transparent)" },
    color: "inherit",
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
  },
  icon: { width: "1rem", height: "1rem", strokeWidth: 2, strokeLinecap: "round" },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});

export default function Toaster(props: ToasterProps) {
  let unsubscribeRef = useRef<() => void>(null);
  // refs, not state: the subscription is created once, so it must read current values
  let lastAnnouncedRef = useRef<number>(0);
  let politeRef = useRef<string>("");
  let assertiveRef = useRef<string>("");

  const state = useStore({
    toasts: NO_TOASTS,
    // live regions exist before any text is injected, so screen readers announce updates reliably
    politeMessage: "",
    assertiveMessage: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    // an identical message must still change the region's text to be announced again (trailing nbsp)
    announce(list: Toast[]) {
      const fresh = list.filter((toast) => toast.id > lastAnnouncedRef);
      if (fresh.length === 0) return;
      lastAnnouncedRef = fresh[fresh.length - 1].id;
      for (const toast of fresh) {
        const text = toast.description ? `${toast.title}. ${toast.description}` : toast.title;
        if (toast.variant === "destructive") {
          assertiveRef = assertiveRef === text ? `${text}\u00a0` : text;
          state.assertiveMessage = assertiveRef;
        } else {
          politeRef = politeRef === text ? `${text}\u00a0` : text;
          state.politeMessage = politeRef;
        }
      }
    },
    runAction(toast: Toast) {
      toast.action?.onClick();
      dismissToast(toast.id);
    },
  });

  onMount(() => {
    unsubscribeRef = subscribeToasts((list) => {
      state.announce(list);
      state.toasts = list;
    });
  });

  onUnMount(() => {
    unsubscribeRef?.();
  });

  return (
    <section
      {...state.attributes}
      aria-label={props.label ?? "Notifications"}
      onMouseEnter={() => pauseToasts()}
      onMouseLeave={() => resumeToasts()}
      onFocus={() => pauseToasts()}
      onBlur={() => resumeToasts()}
      class={clsx(stylex.props(styles.region).className, props.class)}
    >
      <ol class={stylex.props(styles.list).className}>
        <For each={state.toasts}>
          {(toast) => (
            <li
              key={toast.id}
              class={stylex.props(styles.toast, toast.variant === "destructive" && styles.destructive).className}
            >
              <div class={stylex.props(styles.content).className}>
                <p class={stylex.props(styles.title).className}>{toast.title}</p>
                {toast.description && <p class={stylex.props(styles.description).className}>{toast.description}</p>}
              </div>
              {toast.action && (
                <button type="button" onClick={() => state.runAction(toast)} class={stylex.props(styles.action).className}>
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                class={stylex.props(styles.dismiss).className}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={stylex.props(styles.icon).className}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          )}
        </For>
      </ol>
      <div role="status" class={stylex.props(styles.visuallyHidden).className}>
        {state.politeMessage}
      </div>
      <div role="alert" class={stylex.props(styles.visuallyHidden).className}>
        {state.assertiveMessage}
      </div>
    </section>
  );
}

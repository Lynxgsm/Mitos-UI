import { onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <dialog>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "open", "onClose", "title", "description", "footer", "alert", "id", "class",
];

const FOCUSABLE = "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

export type DialogProps = {
  open: boolean;
  onClose?: () => void;
  title: any;
  description?: any;
  children?: any;
  footer?: any;
  alert?: boolean;
  id?: string;
  class?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const DURATION = { default: "200ms", "@media (prefers-reduced-motion: reduce)": "0s" };

const enter = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(0.5rem) scale(0.98)" },
  to: { opacity: 1, transform: "none" },
});

const fade = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

// box-sizing: padding counts in max-height, so the dialog never exceeds the viewport
const styles = stylex.create({
  dialog: {
    boxSizing: "border-box",
    width: "min(32rem, calc(100vw - 2rem))",
    maxHeight: "calc(100dvh - 2rem)",
    padding: "1.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--mitos-border"],
    borderRadius: radii["--mitos-radius-xl"],
    backgroundColor: colors["--mitos-background"],
    color: colors["--mitos-foreground"],
    boxShadow: `0 24px 48px -12px ${colors["--mitos-overlay"]}`,
    animationName: enter,
    animationDuration: DURATION,
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    "::backdrop": {
      backgroundColor: colors["--mitos-overlay"],
      animationName: fade,
      animationDuration: DURATION,
    },
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
  },
  title: { margin: 0, fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
  description: { margin: "0.375rem 0 0", fontSize: "0.875rem", color: colors["--mitos-muted-foreground"] },
  body: { marginTop: "1rem" },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "0.5rem",
    marginTop: "1.5rem",
  },
  close: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "2rem",
    height: "2rem",
    marginTop: "-0.25rem",
    marginRight: "-0.5rem",
    padding: 0,
    borderStyle: "none",
    borderRadius: radii["--mitos-radius-md"],
    backgroundColor: { default: "transparent", ":hover": colors["--mitos-accent"] },
    color: colors["--mitos-muted-foreground"],
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
  },
  icon: { width: "1rem", height: "1rem", strokeWidth: 2, strokeLinecap: "round" },
});

export default function Dialog(props: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // element focused before opening, focused again on close (APG); explicit so it works everywhere
  let returnFocusRef = useRef<HTMLElement | null>(null);

  const state = useStore({
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    partId(part: string) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}` : undefined;
    },
    sync() {
      const dialog = dialogRef;
      if (!dialog) return;
      if (props.open && !dialog.open) {
        returnFocusRef = document.activeElement as HTMLElement;
        dialog.showModal();
        // showModal focuses the first focusable element natively; enforce it for older engines
        if (!dialog.contains(document.activeElement)) {
          const target = (dialog.querySelector("[autofocus]") ?? dialog.querySelector(FOCUSABLE) ?? dialog) as HTMLElement;
          target.focus();
        }
      } else if (!props.open && dialog.open) {
        dialog.close();
      }
    },
    // Escape fires `cancel`: keep the dialog open and let the parent decide through onClose
    handleCancel(event: any) {
      event.preventDefault();
      props.onClose?.();
    },
    // any other close (form method=dialog, browser close watcher): report it and restore focus
    handleClose() {
      if (props.open) props.onClose?.();
      const target = returnFocusRef;
      if (target && target.isConnected) target.focus();
      returnFocusRef = null;
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-dialog-${Math.random().toString(36).slice(2, 10)}`;
    state.sync();
  });

  onUpdate(() => {
    state.sync();
  }, [props.open]);

  return (
    <dialog
      {...state.attributes}
      ref={dialogRef}
      id={props.id}
      role={props.alert ? "alertdialog" : undefined}
      aria-labelledby={state.partId("title")}
      aria-describedby={props.description ? state.partId("description") : undefined}
      onCancel={(event) => state.handleCancel(event)}
      onClose={() => state.handleClose()}
      class={clsx(stylex.props(styles.dialog).className, props.class)}
    >
      <div class={stylex.props(styles.header).className}>
        <div>
          <h2 id={state.partId("title")} class={stylex.props(styles.title).className}>
            {props.title}
          </h2>
          {props.description && (
            <p id={state.partId("description")} class={stylex.props(styles.description).className}>
              {props.description}
            </p>
          )}
        </div>
        {!props.alert && (
          <button
            type="button"
            aria-label="Close"
            onClick={() => props.onClose?.()}
            class={stylex.props(styles.close).className}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={stylex.props(styles.icon).className}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {props.children && <div class={stylex.props(styles.body).className}>{props.children}</div>}
      {props.footer && <div class={stylex.props(styles.footer).className}>{props.footer}</div>}
    </dialog>
  );
}

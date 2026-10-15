import { For, onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "options", "defaultValue", "onValueChange", "name", "placeholder", "description", "error", "emptyText",
  "id", "class",
];

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

export type ComboboxProps = {
  label: any;
  options: ComboboxOption[];
  // value of the option selected at first; the text field shows its label
  // shortcut: uncontrolled only, add a controlled value prop when a form library needs it
  defaultValue?: string;
  // called with the value of the chosen option, or an empty string when the field is cleared
  onValueChange?: (value: string) => void;
  // submits the selected value, not the typed text, with the form
  name?: string;
  placeholder?: string;
  description?: any;
  error?: any;
  // shown when no option matches the text
  emptyText?: string;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <input>
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// space kept between the list and the field, and between the list and the edges of the viewport
const GAP = 4;
const MARGIN = 8;

const styles = stylex.create({
  anchor: { position: "relative" },
  popup: {
    position: "absolute",
    insetInline: 0,
    zIndex: 50,
    maxHeight: "15rem",
    overflowY: "auto",
    padding: "0.25rem",
    boxSizing: "border-box",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--mitos-border"],
    borderRadius: radii["--mitos-radius-md"],
    backgroundColor: colors["--mitos-background"],
    boxShadow: `0 8px 24px -8px ${colors["--mitos-overlay"]}`,
  },
  // only while open: a display value would override the hidden attribute and keep the closed list on screen
  open: { display: "grid" },
  below: { top: "calc(100% + 0.25rem)" },
  list: { display: "grid", margin: 0, padding: 0, listStyle: "none" },
  option: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    minHeight: "2rem",
    paddingInline: "0.5rem",
    fontSize: "0.875rem",
    color: colors["--mitos-foreground"],
    borderRadius: radii["--mitos-radius-sm"],
    cursor: "pointer",
  },
  // the option under the arrows or the pointer: the focus stays in the field (aria-activedescendant)
  active: {
    color: colors["--mitos-accent-foreground"],
    backgroundColor: colors["--mitos-accent"],
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors["--mitos-ring"],
  },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
  check: { width: "1rem", height: "1rem", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
  empty: { margin: 0, paddingBlock: "0.375rem", paddingInline: "0.5rem", fontSize: "0.875rem", color: colors["--mitos-muted-foreground"] },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
});

export default function Combobox(props: ComboboxProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const state = useStore({
    open: false,
    selected: props.defaultValue ?? "",
    text: props.options.find((option) => option.value === props.defaultValue)?.label ?? "",
    // typing filters the options; opening with the arrows or a click shows them all
    filtering: false,
    // index in props.options of the highlighted option, -1 for none
    activeIndex: -1,
    // opens above the field when there is no room below; the offset is measured from the field
    above: false,
    aboveOffset: 0,
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    partId(part: string) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}` : undefined;
    },
    get visible() {
      const query = state.text.trim().toLowerCase();
      return props.options
        .map((option, index) => ({ ...option, index }))
        .filter((option) => !state.filtering || option.label.toLowerCase().includes(query));
    },
    get describedBy() {
      const ids = [props.error && state.partId("error"), props.description && state.partId("description")];
      return ids.filter(Boolean).join(" ") || undefined;
    },
    get status() {
      if (!state.open || !state.filtering) return "";
      const count = state.visible.length;
      return count === 1 ? "1 result" : `${count} results`;
    },
    get popupStyle() {
      return (state.above ? { bottom: `${state.aboveOffset}px` } : {}) as any;
    },
    // flips above when the list does not fit below the field but fits above it
    place() {
      const popup = popupRef;
      const input = inputRef;
      if (!popup || !input || !anchorRef) return;
      const box = input.getBoundingClientRect();
      const fitsBelow = box.bottom + GAP + popup.offsetHeight <= window.innerHeight - MARGIN;
      const fitsAbove = box.top - GAP - popup.offsetHeight >= MARGIN;
      state.above = !fitsBelow && fitsAbove;
      state.aboveOffset = anchorRef.offsetHeight - input.offsetTop + GAP;
    },
    show(filter: boolean) {
      state.filtering = filter;
      if (!state.open) {
        state.open = true;
        requestAnimationFrame(() => state.place());
      }
    },
    close() {
      state.open = false;
      state.filtering = false;
      state.activeIndex = -1;
    },
    // next enabled visible option after the active one, in a direction, wrapping around
    move(step: number) {
      const enabled = state.visible.filter((option) => !option.disabled);
      if (!enabled.length) return;
      const position = enabled.findIndex((option) => option.index === state.activeIndex);
      const next = position < 0 ? (step > 0 ? 0 : enabled.length - 1) : (position + step + enabled.length) % enabled.length;
      state.activeIndex = enabled[next].index;
    },
    choose(option: ComboboxOption) {
      if (option.disabled) return;
      state.selected = option.value;
      state.text = option.label;
      state.close();
      props.onValueChange?.(option.value);
    },
    onInput(event: any) {
      state.text = event.target.value;
      state.activeIndex = -1;
      state.show(true);
    },
    // APG combobox: arrows open and move, Enter chooses, Escape closes then clears, Alt with an arrow only opens
    onKeyDown(event: any) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const wasOpen = state.open;
        state.show(state.filtering);
        if (event.altKey) return;
        if (wasOpen || event.key === "ArrowDown") state.move(event.key === "ArrowDown" ? 1 : -1);
        else state.move(-1);
      } else if (event.key === "Enter") {
        if (!state.open || state.activeIndex < 0) return;
        event.preventDefault();
        state.choose(props.options[state.activeIndex]);
      } else if (event.key === "Escape") {
        if (state.open) {
          event.preventDefault();
          state.close();
        } else if (state.text) {
          event.preventDefault();
          state.text = "";
          state.clear();
        }
      }
    },
    clear() {
      if (!state.selected) return;
      state.selected = "";
      props.onValueChange?.("");
    },
    // leaving the field closes the list; the text goes back to the selected option, or clears it when emptied
    onBlur() {
      state.close();
      if (!state.text.trim()) {
        state.text = "";
        state.clear();
      } else {
        state.text = props.options.find((option) => option.value === state.selected)?.label ?? "";
      }
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-combobox-${Math.random().toString(36).slice(2, 10)}`;
  });

  // keeps the highlighted option in view while the arrows scroll a long list
  onUpdate(() => {
    if (state.activeIndex < 0 || !popupRef) return;
    (popupRef.querySelector(`[data-index="${state.activeIndex}"]`) as HTMLElement | null)?.scrollIntoView?.({ block: "nearest" });
  }, [state.activeIndex]);

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      <div ref={anchorRef} class={stylex.props(styles.anchor).className}>
        <label class={stylex.props(field.labelBox).className}>
          <span class={stylex.props(field.label, field.labelText).className}>
            {props.label}
            {props.required && (
              <span aria-hidden="true" class={stylex.props(field.required).className}>
                {" *"}
              </span>
            )}
          </span>
          <input
            {...state.attributes}
            ref={inputRef}
            type="text"
            role="combobox"
            id={props.id}
            value={state.text}
            placeholder={props.placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={state.open}
            aria-controls={state.partId("listbox")}
            aria-activedescendant={state.open && state.activeIndex >= 0 ? state.partId(`option-${state.activeIndex}`) : undefined}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={state.describedBy}
            class={stylex.props(field.box, field.focusRing, field.disabled, props.error && field.invalid).className}
            onInput={(event) => state.onInput(event)}
            onKeyDown={(event) => state.onKeyDown(event)}
            onBlur={() => state.onBlur()}
            onClick={() => state.show(false)}
          />
        </label>
        <div
          ref={popupRef}
          hidden={!state.open}
          style={state.popupStyle}
          class={stylex.props(styles.popup, state.open && styles.open, !state.above && styles.below).className}
        >
          <ul role="listbox" id={state.partId("listbox")} aria-label={typeof props.label === "string" ? props.label : undefined} class={stylex.props(styles.list).className}>
            <For each={state.visible}>
              {(option) => (
                <li
                  key={option.value}
                  role="option"
                  id={state.partId(`option-${option.index}`)}
                  data-index={option.index}
                  aria-selected={option.value === state.selected}
                  aria-disabled={option.disabled ? true : undefined}
                  class={stylex.props(styles.option, option.index === state.activeIndex && styles.active, option.disabled && styles.disabled).className}
                  // chosen on press: preventing the default keeps the focus in the field, which would otherwise close
                  // the list first. The keyboard goes through the field (aria-activedescendant), not the options
                  onMouseDown={(event) => {
                    event.preventDefault();
                    state.choose(option);
                  }}
                  onMouseEnter={() => (option.disabled ? null : (state.activeIndex = option.index))}
                >
                  {option.label}
                  {option.value === state.selected ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={stylex.props(styles.check).className}>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </li>
              )}
            </For>
          </ul>
          {state.visible.length === 0 ? <p class={stylex.props(styles.empty).className}>{props.emptyText ?? "No results"}</p> : null}
        </div>
      </div>
      <div aria-live="polite" class={stylex.props(styles.visuallyHidden).className}>
        {state.status}
      </div>
      {props.name ? <input type="hidden" name={props.name} value={state.selected} /> : null}
      {props.description && (
        <p id={state.partId("description")} class={stylex.props(field.description).className}>
          {props.description}
        </p>
      )}
      {props.error && (
        <p id={state.partId("error")} class={stylex.props(field.error).className}>
          {props.error}
        </p>
      )}
    </div>
  );
}

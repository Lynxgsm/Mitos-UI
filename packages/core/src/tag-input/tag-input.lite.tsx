import { For, onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the text <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "hideLabel", "description", "error", "value", "defaultValue", "onValueChange", "name", "removeLabel",
  "disabled", "id", "class",
];

export type TagInputProps = {
  label: any;
  // keeps the label as the accessible name but out of sight
  hideLabel?: boolean;
  description?: any;
  error?: any;
  // controlled tags: update them from onValueChange; without it the field keeps its own list
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  // submits the tags joined by commas in a hidden field
  name?: string;
  // accessible name of the remove button of a tag, default Remove followed by the tag
  removeLabel?: (tag: string) => string;
  disabled?: boolean;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the text <input>
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  onBlur?: (event: any) => void;
  onFocus?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  // looks like a field; the ring follows the focus of the text input inside
  box: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.375rem",
    paddingBlock: "0.25rem",
    cursor: "text",
    outlineStyle: { default: "none", ":has(input:focus-visible)": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
    opacity: { default: 1, ":has(input:disabled)": 0.5 },
  },
  list: { display: "contents", margin: 0, padding: 0, listStyle: "none" },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    height: "1.5rem",
    paddingInlineStart: "0.5rem",
    paddingInlineEnd: "0.125rem",
    borderRadius: radii["--mitos-radius-sm"],
    fontSize: "0.75rem",
    color: colors["--mitos-accent-foreground"],
    backgroundColor: colors["--mitos-accent"],
  },
  remove: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.5rem",
    height: "1.5rem",
    padding: 0,
    borderStyle: "none",
    borderRadius: radii["--mitos-radius-sm"],
    color: "inherit",
    backgroundColor: "transparent",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors["--mitos-ring"],
  },
  removeIcon: { width: "0.75rem", height: "0.75rem", strokeWidth: 2, strokeLinecap: "round" },
  text: {
    flexGrow: 1,
    minWidth: "6rem",
    height: "1.5rem",
    padding: 0,
    borderStyle: "none",
    font: "inherit",
    fontSize: "0.875rem",
    color: colors["--mitos-foreground"],
    backgroundColor: "transparent",
    outlineStyle: "none",
    "::placeholder": { color: colors["--mitos-muted-foreground"], opacity: 1 },
  },
});

export default function TagInput(props: TagInputProps) {
  const state = useStore({
    // uncontrolled list, typed by its source: Mitosis drops type assertions
    own: props.defaultValue ?? props.value ?? [],
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    get tags() {
      return props.value ?? state.own;
    },
    partId(part: string) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}` : undefined;
    },
    get describedBy() {
      const ids = [props.error && state.partId("error"), props.description && state.partId("description")];
      return ids.filter(Boolean).join(" ") || undefined;
    },
    nameOfRemove(tag: string) {
      return props.removeLabel ? props.removeLabel(tag) : `Remove ${tag}`;
    },
    commit(tags: string[]) {
      if (props.value === undefined) state.own = tags;
      props.onValueChange?.(tags);
    },
    // adds the typed text as a tag: trimmed, once, never empty
    add(input: any) {
      const tag = String(input.value).trim();
      input.value = "";
      if (!tag || state.tags.includes(tag)) return;
      state.commit([...state.tags, tag]);
    },
    remove(tag: string, event: any) {
      state.commit(state.tags.filter((other) => other !== tag));
      // the button disappears: the focus goes back to the text field
      (event.currentTarget.closest("[data-tag-input]")?.querySelector("input:not([type=hidden])") as HTMLElement | null)?.focus();
    },
    // Enter and comma add the text; Backspace in an empty field removes the last tag
    handleKeyDown(event: any) {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        state.add(event.currentTarget);
      } else if (event.key === "Backspace" && event.currentTarget.value === "" && state.tags.length > 0) {
        state.commit(state.tags.slice(0, -1));
      }
    },
    // text left in the field when it loses the focus becomes a tag too
    handleBlur(event: any) {
      if (event.currentTarget.value.trim()) state.add(event.currentTarget);
      props.onBlur?.(event);
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-tag-input-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)} data-tag-input="">
      <label for={state.partId("input")} class={stylex.props(field.label, props.hideLabel && field.srOnly).className}>
        {props.label}
      </label>
      <div class={stylex.props(field.box, styles.box, props.error && field.invalid).className}>
        <ul aria-label={state.tags.length > 0 ? props.label : undefined} class={stylex.props(styles.list).className}>
          <For each={state.tags}>
            {(tag) => (
              <li key={tag} class={stylex.props(styles.tag).className}>
                {tag}
                <button
                  type="button"
                  aria-label={state.nameOfRemove(tag)}
                  disabled={props.disabled}
                  class={stylex.props(styles.remove).className}
                  onClick={(event) => state.remove(tag, event)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={stylex.props(styles.removeIcon).className}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            )}
          </For>
        </ul>
        <input
          {...state.attributes}
          id={state.partId("input")}
          type="text"
          disabled={props.disabled}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={state.describedBy}
          class={stylex.props(styles.text).className}
          onKeyDown={(event) => state.handleKeyDown(event)}
          onBlur={(event) => state.handleBlur(event)}
        />
      </div>
      {props.name && <input type="hidden" name={props.name} value={state.tags.join(",")} />}
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

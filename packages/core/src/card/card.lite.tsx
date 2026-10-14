import { useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the root <div>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "title", "description", "footer", "headingLevel", "class",
];

export type CardProps = {
  title?: any;
  description?: any;
  children?: any;
  footer?: any;
  // level of the title in the page outline: match the surrounding headings
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  class?: string;
  // native attributes below are forwarded as-is to the root <div>
  id?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  card: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "1.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--mitos-border"],
    borderRadius: radii["--mitos-radius-xl"],
    backgroundColor: colors["--mitos-background"],
    color: colors["--mitos-foreground"],
  },
  title: { margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
  description: { margin: "0.375rem 0 0", fontSize: "0.875rem", color: colors["--mitos-muted-foreground"] },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.5rem",
  },
});

export default function Card(props: CardProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
  });

  return (
    <div {...state.attributes} class={clsx(stylex.props(styles.card).className, props.class)}>
      {(props.title || props.description) && (
        <div>
          {props.title && (
            // role=heading: the right level depends on the page, and a dynamic <hN> tag does not compile everywhere
            <div role="heading" aria-level={props.headingLevel ?? 3} class={stylex.props(styles.title).className}>
              {props.title}
            </div>
          )}
          {props.description && <p class={stylex.props(styles.description).className}>{props.description}</p>}
        </div>
      )}
      {props.children && <div>{props.children}</div>}
      {props.footer && <div class={stylex.props(styles.footer).className}>{props.footer}</div>}
    </div>
  );
}

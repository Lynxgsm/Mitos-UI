import { onMount, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the root <span>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "src", "alt", "fallback", "size", "class",
];

export type AvatarProps = {
  src?: string;
  // accessible name, e.g. the name of the person; empty when that name is already shown next to the avatar
  alt: string;
  // shown when there is no image or it fails to load; defaults to the initials of alt
  fallback?: string;
  size?: "sm" | "md" | "lg";
  class?: string;
  // native attributes below are forwarded as-is to the root <span>
  id?: string;
  title?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  root: {
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "9999px",
    verticalAlign: "middle",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fallback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors["--omni-muted"],
    // foreground, not muted-foreground: initials are text and need 4.5:1 on the muted background
    color: colors["--omni-foreground"],
    fontWeight: 500,
    lineHeight: 1,
    userSelect: "none",
  },
});

const sizes = stylex.create({
  sm: { width: "2rem", height: "2rem", fontSize: "0.75rem" },
  md: { width: "2.5rem", height: "2.5rem", fontSize: "0.875rem" },
  lg: { width: "3rem", height: "3rem", fontSize: "1rem" },
});

export default function Avatar(props: AvatarProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  const state = useStore({
    // the src that failed to load: a new src gets its own chance
    failedSrc: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    get showImage() {
      return Boolean(props.src) && state.failedSrc !== props.src;
    },
    // "Ada Lovelace" → "AL", "grace" → "G" (inline: Mitosis can't compile module-level functions)
    get initials() {
      if (props.fallback !== undefined) return props.fallback;
      const words = props.alt.trim().split(/\s+/).filter(Boolean);
      const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
      return letters.map((word) => word[0]).join("").toUpperCase();
    },
  });

  // an image that failed before hydration never fires onError on the client
  // (comment outside the hook: Mitosis joins hook bodies into one line)
  onMount(() => {
    const image = imageRef;
    if (image && image.complete && image.naturalWidth === 0) state.failedSrc = props.src ?? "";
  });

  return (
    <span
      {...state.attributes}
      class={clsx(stylex.props(styles.root, sizes[props.size ?? "md"]).className, props.class)}
    >
      {state.showImage ? (
        <img
          ref={imageRef}
          src={props.src}
          alt={props.alt}
          class={stylex.props(styles.image).className}
          onError={() => {
            state.failedSrc = props.src ?? "";
          }}
        />
      ) : (
        // same accessible name as the image would have had; decorative when alt is ""
        <span
          role={props.alt ? "img" : undefined}
          aria-label={props.alt || undefined}
          aria-hidden={props.alt ? undefined : "true"}
          class={stylex.props(styles.fallback).className}
        >
          {state.initials}
        </span>
      )}
    </span>
  );
}

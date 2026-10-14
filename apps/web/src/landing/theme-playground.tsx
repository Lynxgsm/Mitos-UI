import { useState, type CSSProperties } from "react";
import { Accordion, Button } from "@omni/core/react";
import { CodeBlock } from "../docs/components";

// Accent swatches keep white text at ≥ 4.5:1 on the button in both color schemes.
const ACCENTS = [
  { name: "Default", value: null },
  { name: "Cobalt", value: "#1d4ed8" },
  { name: "Emerald", value: "#047857" },
  { name: "Rose", value: "#be123c" },
] as const;

const RADII = [
  { name: "Sharp", value: "0px" },
  { name: "Soft", value: null },
  { name: "Round", value: "999px" },
] as const;

type Option = { name: string; value: string | null };

function OptionGroup(props: {
  legend: string;
  name: string;
  options: readonly Option[];
  selected: Option;
  onSelect: (option: Option) => void;
  swatches?: boolean;
}) {
  return (
    <fieldset className="playground-group">
      <legend>{props.legend}</legend>
      <div className="playground-options">
        {props.options.map((option) => (
          <label key={option.name} className="playground-option">
            <input
              type="radio"
              name={props.name}
              className="visually-hidden"
              checked={option === props.selected}
              onChange={() => props.onSelect(option)}
            />
            {props.swatches && (
              <span
                aria-hidden="true"
                className="playground-swatch"
                style={{ background: option.value ?? "var(--omni-primary)" }}
              />
            )}
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ThemePlayground() {
  const [accent, setAccent] = useState<Option>(ACCENTS[0]);
  const [radius, setRadius] = useState<Option>(RADII[1]);

  const overrides: Record<string, string> = {};
  if (accent.value) {
    overrides["--omni-primary"] = accent.value;
    overrides["--omni-primary-foreground"] = "#ffffff";
  }
  if (radius.value) overrides["--omni-radius-md"] = radius.value;

  const css = Object.keys(overrides).length
    ? `:root {\n${Object.entries(overrides)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join("\n")}\n}`
    : "/* Default theme: nothing to override */";

  return (
    <div className="playground">
      <div className="playground-controls">
        <OptionGroup
          legend="Accent"
          name="accent"
          options={ACCENTS}
          selected={accent}
          onSelect={setAccent}
          swatches
        />
        <OptionGroup legend="Corners" name="radius" options={RADII} selected={radius} onSelect={setRadius} />
        <CodeBlock code={css} label="Generated CSS" />
      </div>
      {/* the same variables a consumer would set on :root, scoped to this preview */}
      <div className="playground-preview" style={overrides as CSSProperties}>
        <div className="playground-buttons">
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
        <Accordion
          aria-label="Preview"
          class="playground-accordion"
          items={[
            { title: "Does my override reach every component?", content: "Yes. Hover states derive from it too." },
            { title: "Do I need a build plugin?", content: "No. It is plain CSS, loaded in any order." },
          ]}
        />
      </div>
    </div>
  );
}

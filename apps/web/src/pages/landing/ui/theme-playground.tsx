import { useState, type CSSProperties } from "react";
import { Accordion, Button } from "@lynxgsm/omni-ui/react";
import { CodeBlock } from "@/shared/ui/code-block";
import { OptionGroup } from "@/shared/ui/option-group";

// Accent swatches keep white text at ≥ 4.5:1 on the button in both color schemes.
const ACCENTS: Record<string, string | null> = { Default: null, Cobalt: "#1d4ed8", Emerald: "#047857", Rose: "#be123c" };
const RADII: Record<string, string | null> = { Sharp: "0px", Soft: null, Round: "999px" };

export function ThemePlayground() {
  const [accent, setAccent] = useState("Default");
  const [radius, setRadius] = useState("Soft");

  const overrides: Record<string, string> = {};
  if (ACCENTS[accent]) {
    overrides["--omni-primary"] = ACCENTS[accent];
    overrides["--omni-primary-foreground"] = "#ffffff";
  }
  if (RADII[radius]) overrides["--omni-radius-md"] = RADII[radius];

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
          options={Object.entries(ACCENTS).map(([id, color]) => ({ id, label: id, swatch: color ?? "var(--omni-primary)" }))}
          value={accent}
          onChange={setAccent}
        />
        <OptionGroup
          legend="Corners"
          name="radius"
          options={Object.keys(RADII).map((id) => ({ id, label: id }))}
          value={radius}
          onChange={setRadius}
        />
        <CodeBlock code={css} label="Generated CSS" language="css" />
      </div>
      {/* the same variables a consumer would set on :root, scoped to this preview */}
      <div className="playground-preview omni-default-theme" style={overrides as CSSProperties}>
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

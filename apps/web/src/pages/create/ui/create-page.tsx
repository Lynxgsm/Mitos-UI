import { useRef, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@lynxgsm/omni-ui/react";
import { XIcon } from "@phosphor-icons/react";
import { CodeBlock } from "@/shared/ui/code-block";
import { InstallCommand } from "@/shared/ui/install-command";
import { SiteHeader } from "@/widgets/site-header";
import { OptionGroup } from "@/shared/ui/option-group";
import { Preview } from "./preview";
import {
  ACCENTS,
  BASES,
  DEFAULT_PRESET,
  RADII,
  randomPreset,
  schemeAwareCss,
  themeCss,
  type Mode,
  type Preset,
} from "@/entities/theme";

// the route (app layer) validates the preset in the URL; the page only reads and updates it
const route = getRouteApi("/create");

const PREVIEW_MODES = [
  { id: "system", label: "Site" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function CreatePage() {
  const preset = route.useSearch();
  const navigate = route.useNavigate();
  const [mode, setMode] = useState<"system" | Mode>("system");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shareUrl, setShareUrl] = useState("");

  const update = (next: Partial<Preset>) =>
    navigate({ search: { ...preset, ...next }, replace: true, resetScroll: false });

  const summary = `${BASES[preset.base].label} base, ${ACCENTS[preset.accent].label} accent, ${RADII[preset.radius].label} radius`;

  function openCode() {
    setShareUrl(window.location.href);
    dialogRef.current?.showModal();
  }

  return (
    <div className="create">
      <SiteHeader />
      {/* scoped to the preview; forced light/dark drops the media query */}
      <style>{mode === "system" ? schemeAwareCss(preset, ".create-preview") : themeCss(preset, ".create-preview", mode)}</style>

      <main id="content" className="create-layout">
        <aside className="create-panel" aria-labelledby="create-title">
          <h1 id="create-title">Create a theme</h1>
          <p className="create-panel-lead">Pick a base, an accent and a radius. Every combination meets WCAG AA.</p>

          <OptionGroup
            legend="Base color"
            name="base"
            value={preset.base}
            onChange={(base) => update({ base: base as Preset["base"] })}
            options={Object.entries(BASES).map(([id, base]) => ({ id, label: base.label, swatch: base.scale[500] }))}
          />
          <OptionGroup
            legend="Accent"
            name="accent"
            value={preset.accent}
            onChange={(accent) => update({ accent: accent as Preset["accent"] })}
            options={Object.entries(ACCENTS).map(([id, accent]) => ({
              id,
              label: accent.label,
              swatch: accent.light ?? BASES[preset.base].scale[900],
            }))}
          />
          <OptionGroup
            legend="Radius"
            name="radius"
            value={preset.radius}
            onChange={(radius) => update({ radius: radius as Preset["radius"] })}
            options={Object.entries(RADII).map(([id, radius]) => ({ id, label: radius.label }))}
          />
          <OptionGroup
            legend="Preview"
            name="mode"
            value={mode}
            onChange={(id) => setMode(id as "system" | Mode)}
            options={PREVIEW_MODES}
          />

          <p role="status" className="create-summary">
            {summary}
          </p>
          <div className="create-actions">
            <Button variant="outline" onClick={() => update(randomPreset())}>
              Shuffle
            </Button>
            <Button variant="ghost" onClick={() => update(DEFAULT_PRESET)}>
              Reset
            </Button>
          </div>
          <Button class="create-get-code" size="lg" onClick={openCode}>
            Get code
          </Button>
        </aside>

        <section className="create-preview" aria-labelledby="create-preview-title">
          <h2 id="create-preview-title" className="visually-hidden">
            Preview
          </h2>
          <Preview />
        </section>
      </main>

      <dialog ref={dialogRef} className="create-dialog" aria-labelledby="create-dialog-title">
        <div className="create-dialog-header">
          <h2 id="create-dialog-title">Use this theme</h2>
          <Button variant="ghost" size="sm" class="site-icon-button" aria-label="Close" onClick={() => dialogRef.current?.close()}>
            <XIcon aria-hidden="true" size={16} weight="bold" />
          </Button>
        </div>
        <p className="create-muted">{summary}.</p>
        <h3>1. Install the package</h3>
        <InstallCommand packages="@lynxgsm/omni-ui" />
        <h3>2. Import the styles</h3>
        <CodeBlock code={`import "@lynxgsm/omni-ui/react/styles.css";`} />
        <h3>3. Add your theme</h3>
        <p className="create-muted">Paste it in any stylesheet. It overrides the defaults whatever the load order.</p>
        <CodeBlock code={themeCss(preset)} label="Theme CSS" language="css" />
        <h3>Share</h3>
        <CodeBlock code={shareUrl} label="Link to this theme" language="text" />
      </dialog>
    </div>
  );
}

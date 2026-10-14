import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import TooltipDemo from "../examples/tooltip-demo";
import tooltipDemoSource from "../examples/tooltip-demo?raw";

export function TooltipPage() {
  return (
    <DocsPage
      title="Tooltip"
      description="A short description of an element, shown on hover and focus."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={TooltipDemo} source={tooltipDemoSource} label="Tooltip demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Tooltip usage"
          react={`
import { Button, Tooltip } from "@omni/core/react";

<Tooltip content="Copy to clipboard">
  <Button aria-label="Copy">⧉</Button>
</Tooltip>`}
          svelte={`
<script>
  import { Button, Tooltip } from "@omni/core/svelte";
</script>

<Tooltip content="Copy to clipboard">
  <Button aria-label="Copy">⧉</Button>
</Tooltip>`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li><code>role="tooltip"</code>, linked to the trigger with <code>aria-describedby</code>: screen readers read it after the name of the trigger.</li>
          <li>Shown on hover (after 300 ms) and right away on focus, so keyboard users get it too.</li>
          <li><kbd>Escape</kbd> dismisses it without moving the focus, and it stays open while the pointer rests on it (WCAG 1.4.13).</li>
          <li>Text only: a tooltip never holds links or buttons, and never carries information found nowhere else.</li>
          <li>Stays inside the viewport: it flips to the other side when the preferred one lacks room, and shifts sideways near the edges. The side used is exposed as <code>data-side</code>.</li>
          <li>Inverted colors (foreground on background) at 4.5:1 in both color schemes.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Tooltip"
          rows={[
            { prop: "content", type: "string", description: "Text of the tooltip." },
            { prop: "children", type: "ReactNode", description: "The trigger: one focusable element." },
            { prop: "side", type: "\"top\" | \"bottom\"", default: "\"top\"", description: "Preferred side; flipped when there is no room." },
            { prop: "id", type: "string", description: "Id of the tooltip, referenced by the trigger." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the wrapping <span>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

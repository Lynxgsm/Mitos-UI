import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import ButtonGroupDemo from "../examples/button-group-demo";
import buttonGroupDemoSource from "../examples/button-group-demo?raw";
import ButtonGroupVertical from "../examples/button-group-vertical";
import buttonGroupVerticalSource from "../examples/button-group-vertical?raw";

export function ButtonGroupPage() {
  return (
    <DocsPage
      title="Button Group"
      description="Related buttons joined into one control, horizontally or vertically."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={ButtonGroupDemo} source={buttonGroupDemoSource} label="Button group demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Button group usage"
          react={`
import { Button, ButtonGroup } from "@lynxgsm/omni-ui/react";

<ButtonGroup aria-label="Text alignment">
  <Button variant="outline">Left</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`}
          svelte={`
<script>
  import { Button, ButtonGroup } from "@lynxgsm/omni-ui/svelte";
</script>

<ButtonGroup aria-label="Text alignment">
  <Button variant="outline">Left</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Vertical</h3>
        <ComponentPreview example={ButtonGroupVertical} source={buttonGroupVerticalSource} label="Vertical button group" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Renders <code>role="group"</code>. Name it with <code>aria-label</code> or <code>aria-labelledby</code>:
            screen readers announce the name when focus enters the group.
          </li>
          <li>
            Every button stays its own tab stop, with its own focus ring drawn above its neighbours. For a single
            choice among options (a toolbar of toggles, a segmented control), a radio group fits better.
          </li>
          <li>Neighbouring buttons share one border, so the group reads as one control.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="ButtonGroup"
          rows={[
            { prop: "aria-label / aria-labelledby", type: "string", description: "Name of the group. Required." },
            {
              prop: "orientation",
              type: '"horizontal" | "vertical"',
              default: '"horizontal"',
              description: "Direction in which the buttons are joined.",
            },
            {
              prop: "children",
              type: "Button[]",
              description: "The buttons, directly inside the group.",
              svelte: { type: "Snippet", description: "The buttons, directly inside the group, between the tags." },
            },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "data-* / native attributes", type: "—", description: "Forwarded to the <div>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

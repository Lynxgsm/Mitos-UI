import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SegmentedControlDemo from "../examples/segmented-control-demo";
import segmentedControlDemoSource from "../examples/segmented-control-demo?raw";
import SegmentedControlIcons from "../examples/segmented-control-icons";
import segmentedControlIconsSource from "../examples/segmented-control-icons?raw";

export function SegmentedControlPage() {
  return (
    <DocsPage
      title="Segmented Control"
      description="A compact single choice drawn as segments: a filter, a view switch."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SegmentedControlDemo} source={segmentedControlDemoSource} label="Segmented control demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Segmented control usage"
          react={`
import { SegmentedControl } from "mitos-ui/react";

<SegmentedControl legend="Show" hideLegend name="kind" value={kind} onValueChange={setKind} options={kinds} />`}
          svelte={`
<script>
  import { SegmentedControl } from "mitos-ui/svelte";
  let kind = $state("all");
</script>

<SegmentedControl legend="Show" hideLegend name="kind" value={kind} onValueChange={(next) => (kind = next)} options={kinds} />`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Icon-only options</h3>
        <ComponentPreview example={SegmentedControlIcons} source={segmentedControlIconsSource} label="Segmented control with icons" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Native radios in a <code>&lt;fieldset&gt;</code> with <code>role="radiogroup"</code>: one tab stop, the arrows
            move and select, and the value is submitted with the form.
          </li>
          <li>The legend names the group; <code>hideLegend</code> hides it from sight only.</li>
          <li>
            An icon-only option is named by its <code>label</code> and shows it as a tooltip; the icon is hidden from
            assistive technologies.
          </li>
          <li>The selected segment is marked by its background and border, not by its color alone.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="SegmentedControl"
          rows={[
            { prop: "legend", type: "ReactNode", description: "Names the group." },
            { prop: "hideLegend", type: "boolean", default: "false", description: "Hides the legend from sight; it still names the group." },
            {
              prop: "options",
              type: "{ value, label, icon?, hideLabel?, disabled? }[]",
              description: "The choices. hideLabel shows only the icon; the label still names the option.",
            },
            { prop: "name", type: "string", description: "Groups the radios and names the submitted value." },
            { prop: "value / defaultValue", type: "string", description: "Controlled or initial selection." },
            { prop: "onValueChange", type: "(value: string) => void", description: "Called with the chosen value." },
            { prop: "disabled", type: "boolean", default: "false", description: "Disables every option." },
            { prop: "class", type: "string", description: "Extra classes for the fieldset." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <fieldset>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

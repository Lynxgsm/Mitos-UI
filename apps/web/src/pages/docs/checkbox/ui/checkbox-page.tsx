import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import CheckboxDemo from "../examples/checkbox-demo";
import checkboxDemoSource from "../examples/checkbox-demo?raw";
import CheckboxStates from "../examples/checkbox-states";
import checkboxStatesSource from "../examples/checkbox-states?raw";

export function CheckboxPage() {
  return (
    <DocsPage
      title="Checkbox"
      description="A control to turn an option on or off, or to show a partly selected group."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={CheckboxDemo} source={checkboxDemoSource} label="Checkbox demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Checkbox usage"
          react={`
import { Checkbox } from "mitos-ui/react";

<Checkbox label="Remember me" name="remember" />`}
          svelte={`
<script>
  import { Checkbox } from "mitos-ui/svelte";
</script>

<Checkbox label="Remember me" name="remember" />`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>States</h3>
        <ComponentPreview example={CheckboxStates} source={checkboxStatesSource} label="Checkbox states" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native <code>&lt;input type="checkbox"&gt;</code> inside its label: <kbd>Space</kbd> toggles it and clicking the label works.</li>
          <li><code>indeterminate</code> sets the DOM property, announced as "mixed". Update it yourself when the group changes.</li>
          <li><code>error</code> sets <code>aria-invalid</code> and is read before the description.</li>
          <li>The box is drawn the same in every browser; its empty border reaches 3:1 against the page. In forced colors mode the native checkbox comes back.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Checkbox"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the checkbox." },
            { prop: "description", type: "ReactNode", description: "Help text (aria-describedby)." },
            { prop: "error", type: "ReactNode", description: "Error message; sets aria-invalid." },
            { prop: "indeterminate", type: "boolean", default: "false", description: "Mixed state, e.g. a select-all box." },
            {
              prop: "checked / defaultChecked",
              type: "boolean",
              description: "Controlled or initial state.",
              svelte: { prop: "checked", description: "State of the native input; read changes from onchange." },
            },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <input>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

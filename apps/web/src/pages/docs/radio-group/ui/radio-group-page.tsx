import { FrameworkCode } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { PropsTable } from "@/shared/ui/props-table";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import RadioGroupDemo from "../examples/radio-group-demo";
import radioGroupDemoSource from "../examples/radio-group-demo?raw";

export function RadioGroupPage() {
  return (
    <DocsPage
      title="Radio Group"
      description="A set of options where only one can be selected."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={RadioGroupDemo} source={radioGroupDemoSource} label="Radio Group demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Radio Group usage"
          react={`
import { RadioGroup } from "@omni/core/react";

<RadioGroup
  legend="Delivery"
  name="delivery"
  defaultValue="standard"
  options={[
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
  ]}
  onChange={(event) => setDelivery(event.target.value)}
/>`}
          svelte={`
<script>
  import { RadioGroup } from "@omni/core/svelte";
</script>

<RadioGroup
  legend="Delivery"
  name="delivery"
  defaultValue="standard"
  options={[
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
  ]}
  onchange={(event) => (delivery = event.target.value)}
/>`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>Native radios sharing one <code>name</code>: one tab stop for the group, arrow keys move the selection.</li>
          <li>A <code>&lt;fieldset role="radiogroup"&gt;</code> named by its legend, which also carries <code>aria-required</code>, <code>aria-invalid</code> and the help texts.</li>
          <li>Change events bubble from the radios to the group: read <code>event.target.value</code>. With <code>value</code>, the group is controlled: a change the parent does not apply is undone.</li>
          <li>The radios are drawn the same in every browser; in forced colors mode the native radios come back.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="RadioGroup"
          rows={[
            { prop: "legend", type: "ReactNode", description: "Names the group." },
            { prop: "options", type: "{ value, label, disabled? }[]", description: "The choices." },
            { prop: "name", type: "string", description: "Shared by the radios. Required." },
            { prop: "value", type: "string", description: "Controlled selection: update it from onChange." },
            { prop: "defaultValue", type: "string", description: "Initially selected value, when not controlled." },
            { prop: "description / error", type: "ReactNode", description: "Help text and error message of the group." },
            { prop: "required / disabled", type: "boolean", default: "false", description: "Applied to every radio." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <fieldset> (onChange included)." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

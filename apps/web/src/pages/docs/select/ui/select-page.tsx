import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SelectDemo from "../examples/select-demo";
import selectDemoSource from "../examples/select-demo?raw";

export function SelectPage() {
  return (
    <DocsPage
      title="Select"
      description="A native dropdown to pick one value from a list."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SelectDemo} source={selectDemoSource} label="Select demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Select usage"
          react={`
import { Select } from "@omni/core/react";

<Select label="Country" name="country" options={countries} placeholder="Choose a country" required />`}
          svelte={`
<script>
  import { Select } from "@omni/core/svelte";
</script>

<Select label="Country" name="country" options={countries} placeholder="Choose a country" required />`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native <code>&lt;select&gt;</code>: keyboard, typeahead and the mobile picker come from the platform.</li>
          <li>The placeholder is a real option with an empty value: with <code>required</code>, the form refuses it.</li>
          <li>Same label, description and error wiring as Input.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Select"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the select." },
            { prop: "options", type: "{ value, label, disabled? }[]", description: "The choices." },
            { prop: "placeholder", type: "string", description: "First option, with an empty value." },
            { prop: "description / error", type: "ReactNode", description: "Help text and error message." },
            {
              prop: "value / defaultValue",
              type: "string",
              description: "Controlled or initial value.",
              svelte: { prop: "value", description: "Value of the native select; read changes from onchange." },
            },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <select>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

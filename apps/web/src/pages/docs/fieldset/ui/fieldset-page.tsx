import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import FieldsetDemo from "../examples/fieldset-demo";
import fieldsetDemoSource from "../examples/fieldset-demo?raw";

export function FieldsetPage() {
  return (
    <DocsPage
      title="Fieldset"
      description="Groups related fields under a legend."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={FieldsetDemo} source={fieldsetDemoSource} label="Fieldset demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Fieldset usage"
          react={`
import { Fieldset, Input } from "mitos-ui/react";

<Fieldset legend="Contact">
  <Input label="Email" type="email" />
  <Input label="Phone" type="tel" />
</Fieldset>`}
          svelte={`
<script>
  import { Fieldset, Input } from "mitos-ui/svelte";
</script>

<Fieldset legend="Contact">
  <Input label="Email" type="email" />
  <Input label="Phone" type="tel" />
</Fieldset>`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>: screen readers announce the legend when focus enters a field of the group.</li>
          <li><code>disabled</code> disables every field inside, natively.</li>
          <li>Use it for fields that only make sense together (an address, a date range), not around every form.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Fieldset"
          rows={[
            { prop: "legend", type: "ReactNode", description: "Names the group." },
            { prop: "description", type: "ReactNode", description: "Help text for the whole group (aria-describedby)." },
            { prop: "children", type: "ReactNode", description: "The fields." },
            { prop: "disabled", type: "boolean", default: "false", description: "Disables every field inside." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <fieldset>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

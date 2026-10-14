import { FrameworkCode } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { PropsTable } from "@/shared/ui/props-table";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SwitchDemo from "../examples/switch-demo";
import switchDemoSource from "../examples/switch-demo?raw";

export function SwitchPage() {
  return (
    <DocsPage
      title="Switch"
      description="A toggle for a setting that applies immediately."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SwitchDemo} source={switchDemoSource} label="Switch demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Switch usage"
          react={`
import { Switch } from "@omni/core/react";

<Switch label="Email notifications" onChange={(event) => save(event.currentTarget.checked)} />`}
          svelte={`
<script>
  import { Switch } from "@omni/core/svelte";
</script>

<Switch label="Email notifications" onchange={(event) => save(event.currentTarget.checked)} />`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native checkbox with <code>role="switch"</code>: announced as a switch, on or off, and toggled with <kbd>Space</kbd>.</li>
          <li>The label names the setting and never changes with the state: no "On" and "Off" labels.</li>
          <li>Use it for settings that apply right away. In a form submitted later, a Checkbox fits better.</li>
          <li>Track and thumb reach 3:1 against their background; in forced colors mode it falls back to a native checkbox.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Switch"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the setting." },
            { prop: "description", type: "ReactNode", description: "Help text (aria-describedby)." },
            { prop: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state (React); use checked in Svelte." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <input>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ComponentPreview, DocsPage, FrameworkCode, InstallCommand, PropsTable, Section } from "../../../docs/components";
import InputDemo from "../../../docs/examples/input-demo";
import inputDemoSource from "../../../docs/examples/input-demo?raw";
import InputStates from "../../../docs/examples/input-states";
import inputStatesSource from "../../../docs/examples/input-states?raw";

export const Route = createFileRoute("/docs/components/input")({
  head: () => ({ meta: [{ title: "Input · Omni UI" }] }),
  component: InputPage,
});

function InputPage() {
  return (
    <DocsPage
      title="Input"
      description="A single-line text field with its label, help text and error message."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={InputDemo} source={inputDemoSource} label="Input demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Input usage"
          react={`
import { Input } from "@omni/core/react";

<Input label="Email" type="email" name="email" required />`}
          svelte={`
<script>
  import { Input } from "@omni/core/svelte";
</script>

<Input label="Email" type="email" name="email" required />`}
        />
        <p>
          Native attributes (<code>name</code>, <code>value</code>, <code>onChange</code>, <code>autoComplete</code>…)
          go to the <code>&lt;input&gt;</code>, so it works controlled, uncontrolled and inside a plain form. In Svelte,
          handlers are lowercase (<code>oninput</code>, <code>onchange</code>).
        </p>
      </Section>

      <Section id="examples" title="Examples">
        <h3>Description, required, error and disabled</h3>
        <ComponentPreview example={InputStates} source={inputStatesSource} label="Input states" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            The <code>&lt;input&gt;</code> sits inside its <code>&lt;label&gt;</code>: the field is named even before
            hydration, and clicking the label focuses it.
          </li>
          <li>
            <code>error</code> sets <code>aria-invalid</code>; error and description are linked with{" "}
            <code>aria-describedby</code>, error first.
          </li>
          <li>The border reaches 3:1 against the page, so the field is identifiable (WCAG 1.4.11).</li>
          <li>The required asterisk is visual only: the native required state is what assistive tech announces.</li>
          <li>A placeholder is never a label: always pass <code>label</code>.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Input"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the field." },
            { prop: "description", type: "ReactNode", description: "Help text below the field (aria-describedby)." },
            { prop: "error", type: "ReactNode", description: "Error message; sets aria-invalid and is read first." },
            { prop: "required / disabled / readOnly", type: "boolean", description: "Native states; required adds a visual asterisk." },
            { prop: "id", type: "string", description: "Field id, base of the description and error ids." },
            { prop: "class", type: "string", description: "Extra classes for the wrapper." },
            { prop: "type", type: '"text" | "email" | "password" | "search" | "tel" | "url" | "number"', default: '"text"', description: "Native input type." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <input>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

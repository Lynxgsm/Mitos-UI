import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import TextareaDemo from "../examples/textarea-demo";
import textareaDemoSource from "../examples/textarea-demo?raw";

export function TextareaPage() {
  return (
    <DocsPage
      title="Textarea"
      description="A multi-line text field with its label, help text and error message."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={TextareaDemo} source={textareaDemoSource} label="Textarea demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Textarea usage"
          react={`
import { Textarea } from "mitos-ui/react";

<Textarea label="Message" name="message" rows={5} required />`}
          svelte={`
<script>
  import { Textarea } from "mitos-ui/svelte";
</script>

<Textarea label="Message" name="message" rows={5} required />`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <p>
          Same guarantees as <a href="/docs/components/input">Input</a>: wrapping label, error and description linked
          with <code>aria-describedby</code>, 3:1 border. The field resizes vertically only, so the layout never breaks
          sideways.
        </p>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Textarea"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the field." },
            { prop: "description", type: "ReactNode", description: "Help text below the field (aria-describedby)." },
            { prop: "error", type: "ReactNode", description: "Error message; sets aria-invalid and is read first." },
            { prop: "required / disabled / readOnly", type: "boolean", description: "Native states; required adds a visual asterisk." },
            { prop: "id", type: "string", description: "Field id, base of the description and error ids." },
            { prop: "class", type: "string", description: "Extra classes for the wrapper." },
            { prop: "rows", type: "number", default: "3", description: "Visible lines." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <textarea>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

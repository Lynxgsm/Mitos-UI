import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import TagInputDemo from "../examples/tag-input-demo";
import tagInputDemoSource from "../examples/tag-input-demo?raw";

export function TagInputPage() {
  return (
    <DocsPage
      title="Tag Input"
      description="A text field that collects a list of tags."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={TagInputDemo} source={tagInputDemoSource} label="Tag input demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Tag input usage"
          react={`
import { TagInput } from "mitos-ui/react";

<TagInput label="Personal tags" name="tags" value={tags} onValueChange={setTags} />`}
          svelte={`
<script>
  import { TagInput } from "mitos-ui/svelte";
  let tags = $state(["forms"]);
</script>

<TagInput label="Personal tags" name="tags" value={tags} onValueChange={(next) => (tags = next)} />`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native text field named by its label; the tags are a list named by the same label.</li>
          <li>
            <kbd>Enter</kbd> or a comma adds the text as a tag, <kbd>Backspace</kbd> in an empty field removes the last
            one, and text left in the field is added when the focus leaves it.
          </li>
          <li>
            Every tag has its own remove button, named <code>Remove tag</code> (translate it with{" "}
            <code>removeLabel</code>); after a removal the focus goes back to the field.
          </li>
          <li>The focus ring is drawn around the whole field while its text input has the focus.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="TagInput"
          rows={[
            { prop: "label", type: "ReactNode", description: "Names the field and the list of tags." },
            { prop: "hideLabel", type: "boolean", default: "false", description: "Hides the label from sight; it still names the field." },
            { prop: "value / defaultValue", type: "string[]", description: "Controlled or initial tags." },
            { prop: "onValueChange", type: "(tags: string[]) => void", description: "Called with the new list after every change." },
            { prop: "name", type: "string", description: "Submits the tags joined by commas in a hidden field." },
            { prop: "removeLabel", type: "(tag: string) => string", description: "Accessible name of the remove button of a tag." },
            { prop: "description / error", type: "ReactNode", description: "Help text and error message." },
            { prop: "disabled", type: "boolean", default: "false", description: "Disables the field and the remove buttons." },
            { prop: "class", type: "string", description: "Extra classes for the wrapper." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the text <input>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

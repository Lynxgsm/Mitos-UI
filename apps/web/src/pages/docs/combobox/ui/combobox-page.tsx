import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import ComboboxDemo from "../examples/combobox-demo";
import comboboxDemoSource from "../examples/combobox-demo?raw";

export function ComboboxPage() {
  return (
    <DocsPage
      title="Combobox"
      description="A text field that filters a list of options as you type."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={ComboboxDemo} source={comboboxDemoSource} label="Combobox demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <p>
          Use it when the list is long enough to search. For a few options, a <code>Select</code> or a{" "}
          <code>RadioGroup</code> is simpler.
        </p>
        <FrameworkCode
          label="Combobox usage"
          react={`
import { Combobox } from "mitos-ui/react";

<Combobox
  label="Country"
  name="country"
  options={countries}
  placeholder="Search a country"
  onValueChange={(value) => setCountry(value)}
/>`}
          svelte={`
<script>
  import { Combobox } from "mitos-ui/svelte";

  let country = $state("");
</script>

<Combobox
  label="Country"
  name="country"
  options={countries}
  placeholder="Search a country"
  onValueChange={(value) => (country = value)}
/>`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Follows the WAI-ARIA combobox pattern with list autocomplete: an <code>&lt;input role="combobox"&gt;</code>{" "}
            controls a <code>listbox</code>.
          </li>
          <li>
            The focus stays in the field. The highlighted option is announced through <code>aria-activedescendant</code>.
          </li>
          <li>
            <kbd>↓</kbd> and <kbd>↑</kbd> open the list and move through it, skipping disabled options. <kbd>Alt</kbd>{" "}
            + <kbd>↓</kbd> opens it without moving. <kbd>Enter</kbd> chooses. <kbd>Escape</kbd> closes the list, then
            clears the field.
          </li>
          <li>While typing, a polite live region announces the number of results.</li>
          <li>The list opens above the field when there is no room below it.</li>
          <li>
            Leaving the field puts back the label of the chosen option. The value is always one of the options, never free
            text.
          </li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Combobox"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the field and the list." },
            { prop: "options", type: "{ value, label, disabled? }[]", description: "The choices, filtered by their label." },
            { prop: "defaultValue", type: "string", description: "Value of the option chosen at first." },
            { prop: "onValueChange", type: "(value: string) => void", description: "Called with the chosen value, or an empty string when cleared." },
            { prop: "name", type: "string", description: "Submits the chosen value, not the typed text, with the form." },
            { prop: "placeholder", type: "string", description: "Hint shown in the empty field." },
            { prop: "emptyText", type: "string", default: '"No results"', description: "Shown when no option matches." },
            { prop: "description / error", type: "ReactNode", description: "Help text and error message." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <input> (required, disabled…)." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import ButtonDemo from "../examples/button-demo";
import buttonDemoSource from "../examples/button-demo?raw";
import ButtonVariants from "../examples/button-variants";
import buttonVariantsSource from "../examples/button-variants?raw";
import ButtonSizes from "../examples/button-sizes";
import buttonSizesSource from "../examples/button-sizes?raw";
import ButtonIcon from "../examples/button-icon";
import buttonIconSource from "../examples/button-icon?raw";
import ButtonDisabled from "../examples/button-disabled";
import buttonDisabledSource from "../examples/button-disabled?raw";

export function ButtonPage() {
  return (
    <DocsPage
      title="Button"
      description="Displays a button or a component that looks like a button."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={ButtonDemo} source={buttonDemoSource} label="Button demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Button usage"
          react={`
import { Button } from "@lynxgsm/omni-ui/react";

<Button variant="outline">Button</Button>`}
          svelte={`
<script>
  import { Button } from "@lynxgsm/omni-ui/svelte";
</script>

<Button variant="outline">Button</Button>`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Variants</h3>
        <ComponentPreview example={ButtonVariants} source={buttonVariantsSource} label="Button variants" />
        <h3>Sizes</h3>
        <ComponentPreview example={ButtonSizes} source={buttonSizesSource} label="Button sizes" />
        <h3>Icon only</h3>
        <ComponentPreview example={ButtonIcon} source={buttonIconSource} label="Icon button" />
        <h3>Disabled</h3>
        <ComponentPreview example={ButtonDisabled} source={buttonDisabledSource} label="Disabled button" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>Renders a native <code>&lt;button&gt;</code>: keyboard (Enter, Space) and focus come from the browser.</li>
          <li>
            Defaults to <code>type="button"</code>, so it never submits a form by accident. Pass{" "}
            <code>type="submit"</code> explicitly.
          </li>
          <li>
            Icon-only buttons need an <code>aria-label</code>; <code>aria-*</code> attributes such as{" "}
            <code>aria-expanded</code> or <code>aria-pressed</code> are forwarded.
          </li>
          <li>Visible focus ring on keyboard navigation, 3:1 contrast against the page.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Button"
          rows={[
            {
              prop: "variant",
              type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive"',
              default: '"default"',
              description: "Visual style.",
            },
            {
              prop: "size",
              type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"',
              default: '"md"',
              description: "Height, padding and font size.",
            },
            { prop: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Native button type." },
            { prop: "disabled", type: "boolean", default: "false", description: "Disables interaction." },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "onClick", type: "(event) => void", description: "Called on activation (click, Enter, Space)." },
            {
              prop: "aria-* / data-* / native attributes",
              type: "—",
              description: "Forwarded to the <button> (id, name, value, form, title, onFocus…).",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

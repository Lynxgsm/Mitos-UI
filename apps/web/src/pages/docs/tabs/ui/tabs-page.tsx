import { FrameworkCode } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { PropsTable } from "@/shared/ui/props-table";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import TabsDemo from "../examples/tabs-demo";
import tabsDemoSource from "../examples/tabs-demo?raw";
import TabsVertical from "../examples/tabs-vertical";
import tabsVerticalSource from "../examples/tabs-vertical?raw";

export function TabsPage() {
  return (
    <DocsPage
      title="Tabs"
      description="Sections of content shown one at a time, switched with tabs."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={TabsDemo} source={tabsDemoSource} label="Tabs demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Tabs usage"
          react={`
import { Tabs } from "@omni/core/react";

<Tabs
  label="Account settings"
  items={[
    { value: "profile", label: "Profile", content: <ProfileForm /> },
    { value: "security", label: "Security", content: <SecurityForm /> },
  ]}
/>`}
          svelte={`
<script>
  import { Tabs } from "@omni/core/svelte";
</script>

<Tabs
  label="Account settings"
  items={[
    { value: "profile", label: "Profile", content: "Your name, photo and bio." },
    { value: "security", label: "Security", content: "Password and two-factor authentication." },
  ]}
/>`}
        />
        <p>In Svelte, <code>label</code> and <code>content</code> take text.</p>
      </Section>

      <Section id="examples" title="Examples">
        <h3>Vertical</h3>
        <ComponentPreview example={TabsVertical} source={tabsVerticalSource} label="Tabs vertical" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>Follows the WAI-ARIA tabs pattern: <code>tablist</code>, <code>tab</code> and <code>tabpanel</code>, each tab linked to its panel.</li>
          <li>One tab stop: <kbd>Tab</kbd> enters on the selected tab, then goes to its panel.</li>
          <li>Arrow keys move the focus and select (<kbd>←</kbd> <kbd>→</kbd>, or <kbd>↑</kbd> <kbd>↓</kbd> when vertical), wrapping around; <kbd>Home</kbd> and <kbd>End</kbd> jump to the ends.</li>
          <li>A disabled tab can be reached, so it is announced, but not selected.</li>
          <li>The selected tab is marked by an underline as well as by its color.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Tabs"
          rows={[
            { prop: "label", type: "string", description: "Names the tab list." },
            { prop: "items", type: "{ value, label, content, disabled? }[]", description: "The tabs and their panels." },
            { prop: "value", type: "string", description: "Controlled selection: update it from onValueChange." },
            { prop: "defaultValue", type: "string", default: "first enabled tab", description: "Initial selection, when not controlled." },
            { prop: "onValueChange", type: "(value) => void", description: "Called when a tab is selected." },
            { prop: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Layout and arrow keys." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the root <div>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

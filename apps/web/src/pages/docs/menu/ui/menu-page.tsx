import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import MenuDemo from "../examples/menu-demo";
import MenuGrouped from "../examples/menu-grouped";
import menuGroupedSource from "../examples/menu-grouped?raw";
import menuDemoSource from "../examples/menu-demo?raw";

export function MenuPage() {
  return (
    <DocsPage
      title="Menu"
      description="A button that opens a list of actions."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={MenuDemo} source={menuDemoSource} label="Menu demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="mitos-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Menu usage"
          react={`
import { Menu } from "mitos-ui/react";

<Menu
  label="Actions"
  items={[
    { label: "Edit", onSelect: () => openEditor() },
    { label: "Delete", onSelect: () => confirmDelete() },
  ]}
/>`}
          svelte={`
<script>
  import { Menu } from "mitos-ui/svelte";
</script>

<Menu
  label="Actions"
  items={[
    { label: "Edit", onSelect: () => openEditor() },
    { label: "Delete", onSelect: () => confirmDelete() },
  ]}
/>`}
        />
        <p>For navigation, use a list of links instead: a menu is for actions.</p>
      </Section>

      <Section id="examples" title="Examples">
        <h3>Icons, groups and an icon-only trigger</h3>
        <ComponentPreview example={MenuGrouped} source={menuGroupedSource} label="Menu with icons and groups" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>Follows the WAI-ARIA menu button pattern: <code>aria-haspopup="menu"</code> and <code>aria-expanded</code> on the button, <code>role="menu"</code> and <code>menuitem</code> in the list.</li>
          <li><kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>↓</kbd> open it on the first item, <kbd>↑</kbd> on the last.</li>
          <li>Inside: arrows (wrapping), <kbd>Home</kbd>, <kbd>End</kbd>, and typing a letter jumps to the next item starting with it.</li>
          <li><kbd>Escape</kbd> closes it and gives the focus back to the button; <kbd>Tab</kbd> or a click elsewhere closes it.</li>
          <li>Stays inside the viewport: it opens above the button when there is no room below, and on the other edge when it would overflow sideways (<code>data-side</code>, <code>data-align</code>).</li>
          <li>A disabled item stays reachable, so it is announced, but does nothing.</li>
          <li>A group is a <code>role="group"</code> named by its visible title; the arrows move through groups as one list.</li>
          <li>An icon-only trigger has no visible text: give it an <code>aria-label</code>, which also names the menu.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Menu"
          rows={[
            { prop: "label", type: "ReactNode", description: "Text of the button; also names the menu." },
            {
              prop: "items",
              type: "({ label, onSelect, disabled?, icon?, destructive? } | { title, items })[]",
              description: "The actions. A { title, items } entry is a group: its title names it and separators set it apart. icon is decorative; destructive draws the item in the destructive color.",
            },
            { prop: "align", type: "\"start\" | \"end\"", default: "\"start\"", description: "Preferred edge of the button the menu lines up with; swapped when it would overflow." },
            { prop: "variant", type: "\"outline\" | \"ghost\"", default: "\"outline\"", description: "Look of the trigger." },
            { prop: "icon", type: "boolean", default: "false", description: "Square trigger showing only label (an icon), without the chevron. Name it with aria-label." },
            { prop: "disabled", type: "boolean", default: "false", description: "Disables the button." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the trigger <button>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

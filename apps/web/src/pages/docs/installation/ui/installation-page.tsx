import { FrameworkCode } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { DocsPage, Section } from "@/widgets/docs-layout";

export function Installation() {
  return (
    <DocsPage
      title="Installation"
      description="Add Mitos UI to a React 19 or Svelte 5 project. No bundler plugin or CSS-in-JS setup required."
      toc={[
        { id: "install-the-package", title: "Install the package" },
        { id: "import-the-styles", title: "Import the styles" },
        { id: "use-a-component", title: "Use a component" },
        { id: "requirements", title: "Requirements" },
        { id: "svelte", title: "Svelte notes" },
      ]}
    >
      <Section id="install-the-package" title="Install the package">
        <InstallCommand packages="mitos-ui" />
      </Section>
      <Section id="import-the-styles" title="Import the styles">
        <p>Import the stylesheet once, at the root of your app (entry file or root layout).</p>
        <FrameworkCode
          label="Styles import"
          react={`import "mitos-ui/react/styles.css";`}
          svelte={`
<!-- +layout.svelte (SvelteKit) or App.svelte -->
<script>
  import "mitos-ui/svelte/styles.css";
</script>`}
        />
        <p>
          The rules live in CSS cascade layers, so any CSS you write without layers overrides them, whatever the import
          order.
        </p>
      </Section>
      <Section id="use-a-component" title="Use a component">
        <FrameworkCode
          label="First component"
          react={`
import { Button } from "mitos-ui/react";

export default function App() {
  return <Button>Click me</Button>;
}`}
          svelte={`
<script>
  import { Button } from "mitos-ui/svelte";
</script>

<Button>Click me</Button>`}
        />
      </Section>
      <Section id="requirements" title="Requirements">
        <ul>
          <li>React 19 or later, or Svelte 5.</li>
          <li>
            Any bundler or framework that can import a CSS file (Vite, Next.js, TanStack Start, React Router,
            SvelteKit…).
          </li>
          <li>
            Server rendering is supported. React components are marked "use client"; Svelte components ship as{" "}
            <code>.svelte</code> files that your app compiles, for the server and the browser.
          </li>
        </ul>
      </Section>
      <Section id="svelte" title="Svelte notes">
        <p>The props are the same in both frameworks. A few things follow Svelte's conventions:</p>
        <ul>
          <li>
            The components are written in Svelte 5 runes syntax. Children go in the component's content (the{" "}
            <code>children</code> snippet): <code>&lt;Button&gt;Save&lt;/Button&gt;</code>.
            Props typed as content in React (<code>title</code>, <code>description</code>, <code>footer</code>…)
            take text in Svelte.
          </li>
          <li>
            Native event handlers are lowercase, as on any Svelte element: <code>oninput</code>,{" "}
            <code>onfocus</code>… They are forwarded to the underlying element, like any other attribute. The
            component's own callbacks keep their name: <code>onClick</code> on Button (<code>onclick</code> works too), <code>onClose</code> on Dialog.
          </li>
          <li>
            Fields are not bindable: read the value from <code>oninput</code> or from the form, and pass{" "}
            <code>value</code> to control it.
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}

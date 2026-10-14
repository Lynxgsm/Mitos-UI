import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, DocsPage, InstallCommand, Section } from "../../docs/components";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({ meta: [{ title: "Installation · Omni UI" }] }),
  component: Installation,
});

function Installation() {
  return (
    <DocsPage
      title="Installation"
      description="Add Omni UI to any React 19 project. No bundler plugin or CSS-in-JS setup required."
      toc={[
        { id: "install-the-package", title: "Install the package" },
        { id: "import-the-styles", title: "Import the styles" },
        { id: "use-a-component", title: "Use a component" },
        { id: "requirements", title: "Requirements" },
      ]}
    >
      <Section id="install-the-package" title="Install the package">
        <InstallCommand packages="@omni/core" />
      </Section>
      <Section id="import-the-styles" title="Import the styles">
        <p>Import the stylesheet once, at the root of your app (entry file or root layout).</p>
        <CodeBlock code={`import "@omni/core/react/styles.css";`} />
        <p>
          The rules live in CSS cascade layers, so any CSS you write without layers overrides them, whatever the import
          order.
        </p>
      </Section>
      <Section id="use-a-component" title="Use a component">
        <CodeBlock
          code={`
import { Button } from "@omni/core/react";

export default function App() {
  return <Button>Click me</Button>;
}`}
        />
      </Section>
      <Section id="requirements" title="Requirements">
        <ul>
          <li>React 19 or later.</li>
          <li>Any bundler or framework that can import a CSS file (Vite, Next.js, TanStack Start, React Router…).</li>
          <li>Server rendering is supported; interactive components are marked "use client".</li>
        </ul>
      </Section>
    </DocsPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, ComponentPreview, DocsPage, InstallCommand, PropsTable, Section } from "../../../docs/components";
import DialogDemo from "../../../docs/examples/dialog-demo";
import dialogDemoSource from "../../../docs/examples/dialog-demo?raw";
import DialogAlert from "../../../docs/examples/dialog-alert";
import dialogAlertSource from "../../../docs/examples/dialog-alert?raw";

export const Route = createFileRoute("/docs/components/dialog")({
  head: () => ({ meta: [{ title: "Dialog · Omni UI" }] }),
  component: DialogPage,
});

function DialogPage() {
  return (
    <DocsPage
      title="Dialog"
      description="A modal window over the page, built on the native <dialog> element."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={DialogDemo} source={dialogDemoSource} label="Dialog demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <CodeBlock code={`import { Dialog } from "@omni/core/react";`} />
        <CodeBlock
          code={`
const [open, setOpen] = useState(false);

<Dialog open={open} onClose={() => setOpen(false)} title="Edit profile">
  …
</Dialog>`}
        />
        <p>
          The dialog is controlled: <code>open</code> decides, and <code>onClose</code> is called on Escape, on the close
          button or when the browser closes it.
        </p>
      </Section>

      <Section id="examples" title="Examples">
        <h3>Alert dialog</h3>
        <p>
          Use <code>alert</code> to confirm a destructive action. Put the least destructive action first: it receives
          focus.
        </p>
        <ComponentPreview example={DialogAlert} source={dialogAlertSource} label="Alert dialog" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Opens with <code>showModal()</code>: the rest of the page is inert, Tab stays inside, and the dialog sits in
            the browser's top layer.
          </li>
          <li>
            Named by its title (<code>aria-labelledby</code>) and described by its description (
            <code>aria-describedby</code>).
          </li>
          <li>Focus moves to the first focusable element on open and returns to the trigger on close.</li>
          <li>
            <kbd>Escape</kbd> asks to close through <code>onClose</code>; the parent stays in control.
          </li>
          <li>
            <code>alert</code> renders <code>role="alertdialog"</code> without a close button, so the user makes an
            explicit choice.
          </li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Dialog"
          rows={[
            { prop: "open", type: "boolean", description: "Whether the dialog is shown (controlled)." },
            { prop: "onClose", type: "() => void", description: "Called when the user asks to close." },
            { prop: "title", type: "ReactNode", description: "Heading; names the dialog." },
            { prop: "description", type: "ReactNode", description: "Supporting text; describes the dialog." },
            { prop: "children", type: "ReactNode", description: "Body content." },
            { prop: "footer", type: "ReactNode", description: "Actions, aligned to the end." },
            { prop: "alert", type: "boolean", default: "false", description: "Alert dialog for destructive confirmations." },
            { prop: "id", type: "string", description: "Base for the title and description ids (recommended with SSR)." },
            { prop: "class", type: "string", description: "Extra classes for the <dialog>." },
            { prop: "aria-* / data-*", type: "—", description: "Forwarded to the <dialog>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

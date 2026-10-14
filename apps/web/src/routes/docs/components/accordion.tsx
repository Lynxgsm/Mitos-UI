import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, ComponentPreview, DocsPage, InstallCommand, PropsTable, Section } from "../../../docs/components";
import AccordionDemo from "../../../docs/examples/accordion-demo";
import accordionDemoSource from "../../../docs/examples/accordion-demo?raw";
import AccordionMultiple from "../../../docs/examples/accordion-multiple";
import accordionMultipleSource from "../../../docs/examples/accordion-multiple?raw";
import AccordionDisabled from "../../../docs/examples/accordion-disabled";
import accordionDisabledSource from "../../../docs/examples/accordion-disabled?raw";

export const Route = createFileRoute("/docs/components/accordion")({
  head: () => ({ meta: [{ title: "Accordion · Omni UI" }] }),
  component: AccordionPage,
});

function AccordionPage() {
  return (
    <DocsPage
      title="Accordion"
      description="A vertically stacked set of headers that each reveal a section of content."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={AccordionDemo} source={accordionDemoSource} label="Accordion demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <CodeBlock code={`import { Accordion } from "@omni/core/react";`} />
        <CodeBlock
          code={`
<Accordion
  aria-label="FAQ"
  items={[
    { title: "Is it accessible?", content: "Yes." },
    { title: "Is it animated?", content: "Yes, unless reduced motion is on." },
  ]}
/>`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Multiple</h3>
        <p>
          Use <code>multiple</code> to keep several items open, and <code>defaultOpen</code> to open items on first
          render.
        </p>
        <ComponentPreview example={AccordionMultiple} source={accordionMultipleSource} label="Multiple accordion" />
        <h3>Disabled</h3>
        <ComponentPreview example={AccordionDisabled} source={accordionDisabledSource} label="Disabled accordion item" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Built on a definition list: each header is a <code>&lt;dt&gt;</code> holding a native button with{" "}
            <code>aria-expanded</code> and <code>aria-controls</code>; each panel is a <code>&lt;dd&gt;</code>.
          </li>
          <li>Collapsed panels are <code>inert</code>: out of the tab order and hidden from screen readers.</li>
          <li>
            Keyboard: <kbd>Enter</kbd>/<kbd>Space</kbd> toggles; <kbd>↓</kbd> <kbd>↑</kbd> <kbd>Home</kbd>{" "}
            <kbd>End</kbd> move between headers.
          </li>
          <li>
            Animations are disabled when <code>prefers-reduced-motion</code> is set.
          </li>
          <li>
            Pass an <code>id</code> to get stable ids during server rendering; otherwise they are generated after mount.
          </li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Accordion"
          rows={[
            {
              prop: "items",
              type: "{ title: ReactNode; content: ReactNode; disabled?: boolean }[]",
              description: "Headers and their panels, in order.",
            },
            { prop: "multiple", type: "boolean", default: "false", description: "Allow several items open at once." },
            { prop: "defaultOpen", type: "number[]", default: "[]", description: "Indexes of items open on first render." },
            { prop: "id", type: "string", description: "Base for header and panel ids (recommended with SSR)." },
            { prop: "class", type: "string", description: "Extra classes for the <dl>." },
            {
              prop: "aria-* / data-* / title",
              type: "—",
              description: "Forwarded to the <dl>. Give the list a name with aria-label.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

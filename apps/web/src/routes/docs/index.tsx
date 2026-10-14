import { createFileRoute, Link } from "@tanstack/react-router";
import { DocsPage, Section } from "../../docs/components";

export const Route = createFileRoute("/docs/")({
  head: () => ({ meta: [{ title: "Introduction · Omni UI" }] }),
  component: Introduction,
});

function Introduction() {
  return (
    <DocsPage
      title="Introduction"
      description="Accessible, themeable components written once and compiled for each framework."
      toc={[
        { id: "what-it-is", title: "What it is" },
        { id: "principles", title: "Principles" },
      ]}
    >
      <Section id="what-it-is" title="What it is">
        <p>
          Omni UI is a design system authored with <a href="https://mitosis.builder.io/">Mitosis</a> and styled with{" "}
          <a href="https://stylexjs.com/">StyleX</a>. Each component is written once and compiled to a framework
          package. React is available today; Vue and Svelte will follow.
        </p>
        <p>
          The package ships plain JavaScript, types and one precompiled stylesheet: no build plugin is required in your
          app. Start with the <Link to="/docs/installation">installation guide</Link>.
        </p>
      </Section>
      <Section id="principles" title="Principles">
        <ul>
          <li>
            <strong>Accessible by default.</strong> Native elements first, WAI-ARIA patterns when needed, WCAG AA
            contrast checked in CI.
          </li>
          <li>
            <strong>Themeable with plain CSS.</strong> Every color and radius is a <code>--omni-*</code> variable you
            can override. See <Link to="/docs/theming">Theming</Link>.
          </li>
          <li>
            <strong>Open to customization.</strong> Components accept a <code>class</code> and forward native, ARIA and{" "}
            <code>data-*</code> attributes.
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}

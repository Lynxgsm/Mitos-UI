import { CodeBlock } from "@/shared/ui/code-block";
import { DocsPage, Section } from "@/widgets/docs-layout";

const TOKENS = [
  ["--omni-background / --omni-foreground", "Page background and default text."],
  ["--omni-primary / --omni-primary-foreground", "Default button, links."],
  ["--omni-secondary / --omni-secondary-foreground", "Secondary button."],
  ["--omni-muted / --omni-muted-foreground", "Subdued surfaces, secondary text and icons."],
  ["--omni-accent / --omni-accent-foreground", "Hover state of outline and ghost buttons."],
  ["--omni-destructive / --omni-destructive-foreground", "Destructive actions."],
  ["--omni-border / --omni-input", "Borders and form field outlines."],
  ["--omni-ring", "Keyboard focus ring."],
  ["--omni-radius-sm / -md / -lg / -xl", "Corner radii."],
];

export function Theming() {
  return (
    <DocsPage
      title="Theming"
      description="Every color and radius is a CSS variable. Override them in plain CSS to make the components yours."
      toc={[
        { id: "override-a-token", title: "Override a token" },
        { id: "dark-mode", title: "Dark mode" },
        { id: "tokens", title: "Tokens" },
        { id: "accessibility", title: "Accessibility" },
      ]}
    >
      <Section id="override-a-token" title="Override a token">
        <p>Declare the variable in your own stylesheet. No build step, no config file.</p>
        <CodeBlock
          language="css"
          code={`
:root {
  --omni-primary: oklch(0.55 0.2 265);
  --omni-primary-foreground: oklch(0.985 0 0);
  --omni-radius-md: 0.25rem;
}`}
        />
        <p>
          The defaults sit in a CSS cascade layer, so your declaration wins even if it is loaded before the Omni UI
          stylesheet. Hover states are derived from the same variables and follow automatically.
        </p>
        <p>
          To restyle a single component instance, pass a <code>class</code> instead: it is merged after the component's
          own styles.
        </p>
      </Section>
      <Section id="dark-mode" title="Dark mode">
        <p>
          The default theme follows the operating system through <code>prefers-color-scheme</code>. An override in{" "}
          <code>:root</code> applies to both schemes; to set a dark value, add your own media query:
        </p>
        <CodeBlock
          language="css"
          code={`
@media (prefers-color-scheme: dark) {
  :root {
    --omni-primary: oklch(0.75 0.15 265);
  }
}`}
        />
      </Section>
      <Section id="tokens" title="Tokens">
        <div className="props-table-wrapper">
          <table className="props-table">
            <caption className="visually-hidden">Theme tokens</caption>
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">Used for</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map(([name, usage]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="accessibility" title="Accessibility">
        <p>
          The default theme meets WCAG AA in light and dark mode: text at least 4.5:1, focus ring and icons at least
          3:1, hover states included. When you override a color, keep its <code>-foreground</code> pair readable on it.
        </p>
      </Section>
    </DocsPage>
  );
}

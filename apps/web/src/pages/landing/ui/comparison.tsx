import * as library from "@lynxgsm/omni-ui/react";

// counted from the exports, so the claim stays true as components are added
const COMPONENT_COUNT = Object.keys(library).filter((name) => /^[A-Z]/.test(name)).length;

// Both are accessible and themed with CSS variables: the table is about how you get and keep the code.
const ROWS = [
  {
    topic: "How you get it",
    omni: "An npm package: update with your package manager",
    shadcn: "Source copied into your project by a CLI: you own and edit it",
  },
  {
    topic: "Frameworks",
    omni: "React and Svelte from one source; Vue next",
    shadcn: "React; Svelte and Vue through separate community ports",
  },
  {
    topic: "Styling",
    omni: "One precompiled stylesheet, no build plugin",
    shadcn: "Tailwind CSS classes in each component",
  },
  {
    topic: "Accessibility",
    omni: "Native elements first; axe and WCAG AA contrast checked by the test suite",
    shadcn: "Radix UI primitives, maintained upstream",
  },
  {
    topic: "Theming",
    omni: "--omni-* CSS variables in cascade layers: your CSS always wins",
    shadcn: "CSS variables and Tailwind tokens",
  },
  {
    topic: "Catalog",
    omni: `${COMPONENT_COUNT} components, growing`,
    shadcn: "A large catalog of components and blocks",
  },
];

export function Comparison() {
  return (
    <section className="landing-section reveal" aria-labelledby="compare-title">
      <h2 id="compare-title">Omni UI or shadcn/ui?</h2>
      <p className="landing-section-lead">
        Both give you accessible components themed with CSS variables. They differ in how the code reaches your app
        and which frameworks it serves.
      </p>

      {/* focusable and named: on small screens keyboard users scroll it sideways (WCAG 2.1.1) */}
      <div className="compare-table-wrapper" tabIndex={0} role="region" aria-label="Comparison table">
        <table className="compare-table">
          <caption className="visually-hidden">Omni UI compared with shadcn/ui</caption>
          <thead>
            <tr>
              <td />
              <th scope="col">Omni UI</th>
              <th scope="col">shadcn/ui</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.topic}>
                <th scope="row">{row.topic}</th>
                <td>{row.omni}</td>
                <td>{row.shadcn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="compare-choices">
        <div className="compare-choice compare-choice-omni">
          <h3>Choose Omni UI if…</h3>
          <ul>
            <li>your products span React and Svelte, and should look and behave the same;</li>
            <li>you want fixes and new components through a version bump, not a re-copy;</li>
            <li>your app does not use Tailwind, or you want no styling setup at all;</li>
            <li>accessibility must be verified on every build, not reviewed once.</li>
          </ul>
        </div>
        <div className="compare-choice">
          <h3>Choose shadcn/ui if…</h3>
          <ul>
            <li>you want to edit the source of every component in your own repository;</li>
            <li>your stack is React with Tailwind CSS;</li>
            <li>you need a component or block Omni UI does not have yet.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

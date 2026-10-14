import { Link } from "@tanstack/react-router";
import { Accordion } from "@lynxgsm/omni-ui/react";
import { FRAMEWORKS } from "@/entities/framework";
import { SiteHeader } from "@/widgets/site-header";
import { CompileBeams } from "./compile-beams";
import { Comparison } from "./comparison";
import { ThemePlayground } from "./theme-playground";
import { WorksWith } from "./works-with";

function PrimaryActions() {
  return (
    <div className="landing-actions">
      {/* links, not <Button>: navigation must be an <a> (Button has no link rendering yet) */}
      <Link to="/docs/installation" className="site-button">
        Get started
      </Link>
      <Link to="/docs/components/button" className="site-button site-button-outline">
        Browse components
      </Link>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="landing">
      <SiteHeader />

      <main id="content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-hero-copy">
            <h1 id="hero-title">
              Accessible components, <em>written once.</em>
            </h1>
            <p className="landing-hero-lead">
              A design system authored with Mitosis and styled with StyleX. React and Svelte today, Vue next.
            </p>
            <ul className="landing-frameworks" aria-label="Available for">
              {FRAMEWORKS.map(({ id, name, Logo }) => (
                <li key={id}>
                  <Logo />
                  {name}
                </li>
              ))}
            </ul>
            <PrimaryActions />
          </div>
          <div className="landing-hero-preview">
            <Accordion
              aria-label="About Omni UI"
              class="landing-hero-accordion"
              defaultOpen={[0]}
              items={[
                {
                  title: "What do I install?",
                  content: "One package with plain JavaScript, types and a precompiled stylesheet. No build plugin.",
                },
                { title: "Which frameworks?", content: "React and Svelte today, compiled from the same source. Vue is next." },
                { title: "Can I restyle it?", content: "Override any --omni-* variable in your own CSS." },
              ]}
            />
          </div>
        </section>

        <section className="landing-section landing-tools-band reveal" aria-labelledby="tools-title">
          <h2 id="tools-title">Works with your stack</h2>
          <WorksWith />
        </section>

        <section className="landing-section landing-compile reveal" aria-labelledby="compile-title">
          <h2 id="compile-title">One source, compiled per framework</h2>
          <p className="landing-section-lead">
            Components are written in Mitosis, then compiled to idiomatic code for each framework. Same markup, same
            styles, same accessibility.
          </p>
          <CompileBeams />
        </section>

        <section className="landing-section landing-theming reveal" aria-labelledby="theming-title">
          <div className="landing-theming-copy">
            <h2 id="theming-title">Theme it with plain CSS</h2>
            <p className="landing-section-lead">
              Every color and radius is a CSS variable. Override it in your stylesheet and every component follows,
              hover states included.
            </p>
            <Link to="/docs/theming">Read the theming guide</Link>
          </div>
          <ThemePlayground />
        </section>

        <section className="landing-section reveal" aria-labelledby="a11y-title">
          <h2 id="a11y-title">Accessible by default</h2>
          <div className="landing-bento">
            <article className="landing-tile landing-tile-contrast">
              <p className="landing-tile-figure">4.5:1</p>
              <h3>Contrast checked on every build</h3>
              <p>
                The minimum text contrast, verified for every variant and hover state, in light and dark mode. Focus
                rings and icons reach 3:1.
              </p>
            </article>
            <article className="landing-tile landing-tile-native">
              <h3>Native elements first</h3>
              <p>Real buttons and definition lists: roles, focus and form behavior come from the browser.</p>
            </article>
            <article className="landing-tile landing-tile-keys">
              <h3>Complete keyboard support</h3>
              <p>
                <kbd>Tab</kbd> <kbd>Enter</kbd> <kbd>Space</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>Home</kbd>{" "}
                <kbd>End</kbd>, as the WAI-ARIA patterns describe.
              </p>
            </article>
            <article className="landing-tile landing-tile-motion">
              <h3>Motion that steps aside</h3>
              <p>Animations turn off when the system asks for reduced motion.</p>
            </article>
          </div>
        </section>

        <Comparison />

        <section className="landing-cta reveal" aria-labelledby="cta-title">
          <h2 id="cta-title">Start with one component.</h2>
          <PrimaryActions />
        </section>
      </main>

      <footer className="landing-footer">
        <p>Omni UI. Built with Mitosis and StyleX.</p>
        <nav aria-label="Footer">
          <ul>
            <li>
              <Link to="/docs/installation">Installation</Link>
            </li>
            <li>
              <Link to="/docs/theming">Theming</Link>
            </li>
            <li>
              <Link to="/docs/components/button">Button</Link>
            </li>
            <li>
              <Link to="/docs/components/accordion">Accordion</Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

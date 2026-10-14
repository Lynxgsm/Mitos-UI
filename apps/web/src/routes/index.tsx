import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, Button } from "@omni/core/react";
import { CodeBlock } from "../docs/components";
import { ThemePlayground } from "../landing/theme-playground";
import { SiteHeader } from "../site/site-header";
import docsStylesHref from "../docs/docs.css?url";
import landingStylesHref from "../landing/landing.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Omni UI: accessible components, written once" },
      {
        name: "description",
        content: "An accessible design system authored with Mitosis and styled with StyleX. React today, Vue and Svelte next.",
      },
    ],
    // docs.css provides the shared code block and visually-hidden styles
    links: [
      { rel: "stylesheet", href: docsStylesHref },
      { rel: "stylesheet", href: landingStylesHref },
    ],
  }),
  component: Landing,
});

const MITOSIS_SOURCE = `
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/config/tokens.stylex";

const styles = stylex.create({
  base: { backgroundColor: colors["--omni-primary"] },
});

export default function Button(props: ButtonProps) {
  return (
    <button class={stylex.props(styles.base).className} type={props.type ?? "button"}>
      {props.children}
    </button>
  );
}`;

const REACT_OUTPUT = `
"use client";
import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/config/tokens.stylex";

const styles = stylex.create({
  base: { backgroundColor: colors["--omni-primary"] },
});

function Button(props: ButtonProps) {
  return (
    <button className={stylex.props(styles.base).className} type={props.type ?? "button"}>
      {props.children}
    </button>
  );
}

export default Button;`;

function PrimaryActions() {
  return (
    <div className="landing-actions">
      {/* links, not <Button>: navigation must be an <a> (Button has no link rendering yet) */}
      <Link to="/docs/installation" className="site-button">
        Get started
      </Link>
      <Link to="/docs/components/accordion" className="site-button site-button-outline">
        Browse components
      </Link>
    </div>
  );
}

function Landing() {
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
              A design system authored with Mitosis and styled with StyleX. React today, Vue and Svelte next.
            </p>
            <PrimaryActions />
          </div>
          <div className="landing-hero-preview">
            <div className="landing-hero-buttons">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <Accordion
              aria-label="About Omni UI"
              class="landing-hero-accordion"
              defaultOpen={[0]}
              items={[
                {
                  title: "What do I install?",
                  content: "One package with plain JavaScript, types and a precompiled stylesheet. No build plugin.",
                },
                { title: "Which frameworks?", content: "React today. Vue and Svelte are compiled from the same source next." },
                { title: "Can I restyle it?", content: "Override any --omni-* variable in your own CSS." },
              ]}
            />
          </div>
        </section>

        <section className="landing-section landing-compile reveal" aria-labelledby="compile-title">
          <h2 id="compile-title">One source, compiled per framework</h2>
          <p className="landing-section-lead">
            Components are written in Mitosis, then compiled to idiomatic code for each framework. Same markup, same
            styles, same accessibility.
          </p>
          <div className="landing-compile-grid">
            <div>
              <p className="landing-code-title">button.lite.tsx</p>
              <CodeBlock code={MITOSIS_SOURCE} label="Mitosis source, simplified from the Button" />
            </div>
            <div>
              <p className="landing-code-title">React output</p>
              <CodeBlock code={REACT_OUTPUT} label="Compiled React output" />
              <p className="landing-note">Vue and Svelte targets are next, from the same file.</p>
            </div>
          </div>
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

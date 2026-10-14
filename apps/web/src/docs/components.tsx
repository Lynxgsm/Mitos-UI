import { useId, useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@omni/core/react";
import { neighbours } from "./nav";

export type TocEntry = { id: string; title: string };

export function DocsPage(props: { title: string; description: string; toc: TocEntry[]; children: ReactNode }) {
  const { pathname } = useLocation();
  const { previous, next } = neighbours(pathname.replace(/\/$/, "") || "/docs");
  const pager = (
    <nav aria-label="Pagination" className="docs-pager">
      {previous && (
        <Link to={previous.href} rel="prev">
          ← {previous.title}
        </Link>
      )}
      {next && (
        <Link to={next.href} rel="next" className="docs-pager-next">
          {next.title} →
        </Link>
      )}
    </nav>
  );

  return (
    <>
      <article className="docs-article">
        <header className="docs-page-header">
          <h1>{props.title}</h1>
          <p className="docs-lead">{props.description}</p>
        </header>
        {props.children}
        {pager}
      </article>
      {props.toc.length > 0 && (
        <nav aria-label="On this page" className="docs-toc">
          <p className="docs-toc-title">On This Page</p>
          <ul>
            {props.toc.map((entry) => (
              <li key={entry.id}>
                <a href={`#${entry.id}`}>{entry.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export function Section(props: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={props.id} className="docs-section">
      <h2 id={props.id}>{props.title}</h2>
      {props.children}
    </section>
  );
}

export function CodeBlock(props: { code: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(props.code);
      setStatus("copied");
    } catch {
      // clipboard is unavailable outside secure contexts or when permission is denied
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="docs-code">
      {/* focusable so keyboard users can scroll long lines (WCAG 2.1.1) */}
      <pre tabIndex={0} aria-label={props.label ?? "Code"}>
        <code>{props.code.trim()}</code>
      </pre>
      <Button variant="ghost" size="xs" class="docs-copy" onClick={copy}>
        {status === "copied" ? "Copied" : "Copy"}
      </Button>
      <span role="status" className="visually-hidden">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
}

// APG tabs with automatic activation: one tab stop, arrows/Home/End move and select.
export function Tabs(props: { label: string; tabs: { label: string; content: ReactNode }[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent) {
    const last = props.tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (selected === last ? 0 : selected + 1)
      : event.key === "ArrowLeft" ? (selected === 0 ? last : selected - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="docs-tabs">
      <div role="tablist" aria-label={props.label} className="docs-tablist">
        {props.tabs.map((tab, index) => (
          <button
            key={tab.label}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {props.tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

export function ComponentPreview(props: { example: ComponentType; source: string; label: string }) {
  const Example = props.example;
  return (
    <Tabs
      label={props.label}
      tabs={[
        {
          label: "Preview",
          content: (
            <div className="docs-preview">
              <Example />
            </div>
          ),
        },
        { label: "Code", content: <CodeBlock code={props.source} label={`${props.label} source`} /> },
      ]}
    />
  );
}

const PACKAGE_MANAGERS = [
  ["bun", "bun add"],
  ["npm", "npm install"],
  ["pnpm", "pnpm add"],
  ["yarn", "yarn add"],
] as const;

export function InstallCommand(props: { packages: string }) {
  return (
    <Tabs
      label="Package manager"
      tabs={PACKAGE_MANAGERS.map(([name, command]) => ({
        label: name,
        content: <CodeBlock code={`${command} ${props.packages}`} label={`${name} install command`} />,
      }))}
    />
  );
}

export type PropRow = { prop: string; type: string; default?: string; description: string };

export function PropsTable(props: { component: string; rows: PropRow[] }) {
  return (
    <div className="docs-table-wrapper">
      <table className="docs-table">
        <caption className="visually-hidden">{props.component} props</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr key={row.prop}>
              <th scope="row">
                <code>{row.prop}</code>
              </th>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : "—"}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

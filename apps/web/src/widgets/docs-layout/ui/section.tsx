import type { ReactNode } from "react";

export function Section(props: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={props.id} className="docs-section">
      <h2 id={props.id}>{props.title}</h2>
      {props.children}
    </section>
  );
}

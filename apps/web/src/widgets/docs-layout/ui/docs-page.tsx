import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { neighbours } from "../model/nav";

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

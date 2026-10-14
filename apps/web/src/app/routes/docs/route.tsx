import { createFileRoute } from "@tanstack/react-router";
import { DocsLayout, docsLayoutStylesHref } from "@/widgets/docs-layout";
import { SiteHeader } from "@/widgets/site-header";

export const Route = createFileRoute("/docs")({
  head: () => ({ links: [{ rel: "stylesheet", href: docsLayoutStylesHref }] }),
  component: () => <DocsLayout header={<SiteHeader />} />,
});

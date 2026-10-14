import { createFileRoute } from "@tanstack/react-router";
import { BlocksPage, blocksStylesHref } from "@/pages/blocks";

export const Route = createFileRoute("/blocks")({
  head: () => ({
    meta: [
      { title: "Blocks · Omni UI" },
      { name: "description", content: "Ready-made sections built from Omni UI components: sign in, settings, dashboards, pricing and more." },
    ],
    links: [{ rel: "stylesheet", href: blocksStylesHref }],
  }),
  component: BlocksPage,
});

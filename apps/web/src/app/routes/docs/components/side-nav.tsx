import { createFileRoute } from "@tanstack/react-router";
import { SideNavPage } from "@/pages/docs/side-nav";

export const Route = createFileRoute("/docs/components/side-nav")({
  head: () => ({ meta: [{ title: "Side Nav · Omni UI" }] }),
  component: SideNavPage,
});

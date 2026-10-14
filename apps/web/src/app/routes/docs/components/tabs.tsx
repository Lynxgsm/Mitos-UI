import { createFileRoute } from "@tanstack/react-router";
import { TabsPage } from "@/pages/docs/tabs";

export const Route = createFileRoute("/docs/components/tabs")({
  head: () => ({ meta: [{ title: "Tabs · Omni UI" }] }),
  component: TabsPage,
});

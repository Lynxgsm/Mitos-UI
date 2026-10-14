import { createFileRoute } from "@tanstack/react-router";
import { TooltipPage } from "@/pages/docs/tooltip";

export const Route = createFileRoute("/docs/components/tooltip")({
  head: () => ({ meta: [{ title: "Tooltip · Mitos UI" }] }),
  component: TooltipPage,
});

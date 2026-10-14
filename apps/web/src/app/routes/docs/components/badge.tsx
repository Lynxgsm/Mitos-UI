import { createFileRoute } from "@tanstack/react-router";
import { BadgePage } from "@/pages/docs/badge";

export const Route = createFileRoute("/docs/components/badge")({
  head: () => ({ meta: [{ title: "Badge · Omni UI" }] }),
  component: BadgePage,
});

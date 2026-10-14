import { createFileRoute } from "@tanstack/react-router";
import { Installation } from "@/pages/docs/installation";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({ meta: [{ title: "Installation · Omni UI" }] }),
  component: Installation,
});

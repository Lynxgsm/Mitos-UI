import { createFileRoute } from "@tanstack/react-router";
import { Installation } from "@/pages/docs/installation";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({ meta: [{ title: "Installation · Mitos UI" }] }),
  component: Installation,
});

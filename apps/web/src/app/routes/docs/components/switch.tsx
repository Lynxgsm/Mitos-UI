import { createFileRoute } from "@tanstack/react-router";
import { SwitchPage } from "@/pages/docs/switch";

export const Route = createFileRoute("/docs/components/switch")({
  head: () => ({ meta: [{ title: "Switch · Mitos UI" }] }),
  component: SwitchPage,
});

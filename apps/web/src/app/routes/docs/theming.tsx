import { createFileRoute } from "@tanstack/react-router";
import { Theming } from "@/pages/docs/theming";

export const Route = createFileRoute("/docs/theming")({
  head: () => ({ meta: [{ title: "Theming · Omni UI" }] }),
  component: Theming,
});

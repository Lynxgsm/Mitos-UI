import { createFileRoute } from "@tanstack/react-router";
import { ButtonGroupPage } from "@/pages/docs/button-group";

export const Route = createFileRoute("/docs/components/button-group")({
  head: () => ({ meta: [{ title: "Button Group · Omni UI" }] }),
  component: ButtonGroupPage,
});

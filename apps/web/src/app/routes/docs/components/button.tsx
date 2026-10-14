import { createFileRoute } from "@tanstack/react-router";
import { ButtonPage } from "@/pages/docs/button";

export const Route = createFileRoute("/docs/components/button")({
  head: () => ({ meta: [{ title: "Button · Omni UI" }] }),
  component: ButtonPage,
});

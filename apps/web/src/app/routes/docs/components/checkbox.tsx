import { createFileRoute } from "@tanstack/react-router";
import { CheckboxPage } from "@/pages/docs/checkbox";

export const Route = createFileRoute("/docs/components/checkbox")({
  head: () => ({ meta: [{ title: "Checkbox · Omni UI" }] }),
  component: CheckboxPage,
});

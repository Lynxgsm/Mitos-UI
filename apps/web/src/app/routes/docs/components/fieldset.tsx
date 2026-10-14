import { createFileRoute } from "@tanstack/react-router";
import { FieldsetPage } from "@/pages/docs/fieldset";

export const Route = createFileRoute("/docs/components/fieldset")({
  head: () => ({ meta: [{ title: "Fieldset · Omni UI" }] }),
  component: FieldsetPage,
});

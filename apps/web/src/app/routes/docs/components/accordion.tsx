import { createFileRoute } from "@tanstack/react-router";
import { AccordionPage } from "@/pages/docs/accordion";

export const Route = createFileRoute("/docs/components/accordion")({
  head: () => ({ meta: [{ title: "Accordion · Mitos UI" }] }),
  component: AccordionPage,
});

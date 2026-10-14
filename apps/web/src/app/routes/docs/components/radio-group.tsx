import { createFileRoute } from "@tanstack/react-router";
import { RadioGroupPage } from "@/pages/docs/radio-group";

export const Route = createFileRoute("/docs/components/radio-group")({
  head: () => ({ meta: [{ title: "Radio Group · Mitos UI" }] }),
  component: RadioGroupPage,
});

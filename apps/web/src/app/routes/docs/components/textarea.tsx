import { createFileRoute } from "@tanstack/react-router";
import { TextareaPage } from "@/pages/docs/textarea";

export const Route = createFileRoute("/docs/components/textarea")({
  head: () => ({ meta: [{ title: "Textarea · Mitos UI" }] }),
  component: TextareaPage,
});

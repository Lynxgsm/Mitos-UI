import { createFileRoute } from "@tanstack/react-router";
import { SelectPage } from "@/pages/docs/select";

export const Route = createFileRoute("/docs/components/select")({
  head: () => ({ meta: [{ title: "Select · Mitos UI" }] }),
  component: SelectPage,
});

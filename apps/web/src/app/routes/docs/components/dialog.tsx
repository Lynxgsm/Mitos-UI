import { createFileRoute } from "@tanstack/react-router";
import { DialogPage } from "@/pages/docs/dialog";

export const Route = createFileRoute("/docs/components/dialog")({
  head: () => ({ meta: [{ title: "Dialog · Mitos UI" }] }),
  component: DialogPage,
});

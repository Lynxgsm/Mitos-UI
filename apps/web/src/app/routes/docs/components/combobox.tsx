import { createFileRoute } from "@tanstack/react-router";
import { ComboboxPage } from "@/pages/docs/combobox";

export const Route = createFileRoute("/docs/components/combobox")({
  head: () => ({ meta: [{ title: "Combobox · Mitos UI" }] }),
  component: ComboboxPage,
});

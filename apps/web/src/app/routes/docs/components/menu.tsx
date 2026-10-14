import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "@/pages/docs/menu";

export const Route = createFileRoute("/docs/components/menu")({
  head: () => ({ meta: [{ title: "Menu · Mitos UI" }] }),
  component: MenuPage,
});

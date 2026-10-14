import { createFileRoute } from "@tanstack/react-router";
import { CardPage } from "@/pages/docs/card";

export const Route = createFileRoute("/docs/components/card")({
  head: () => ({ meta: [{ title: "Card · Omni UI" }] }),
  component: CardPage,
});

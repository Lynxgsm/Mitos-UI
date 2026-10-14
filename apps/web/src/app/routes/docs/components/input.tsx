import { createFileRoute } from "@tanstack/react-router";
import { InputPage } from "@/pages/docs/input";

export const Route = createFileRoute("/docs/components/input")({
  head: () => ({ meta: [{ title: "Input · Omni UI" }] }),
  component: InputPage,
});

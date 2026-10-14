import { createFileRoute } from "@tanstack/react-router";
import { ToastPage } from "@/pages/docs/toast";

export const Route = createFileRoute("/docs/components/toast")({
  head: () => ({ meta: [{ title: "Toast · Mitos UI" }] }),
  component: ToastPage,
});

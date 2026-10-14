import { createFileRoute } from "@tanstack/react-router";
import { AvatarPage } from "@/pages/docs/avatar";

export const Route = createFileRoute("/docs/components/avatar")({
  head: () => ({ meta: [{ title: "Avatar · Omni UI" }] }),
  component: AvatarPage,
});

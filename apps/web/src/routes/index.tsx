import { createFileRoute } from "@tanstack/react-router";
import { CORE_VERSION } from "@omni/core";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <h1>Omni System UI</h1>
      <p>@omni/core v{CORE_VERSION}</p>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@omni/core/react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>Omni System UI</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</Button>
      <Button variant="secondary" disabled>
        Disabled
      </Button>
      <Button variant="secondary" class="custom-button">
        Custom class
      </Button>
    </main>
  );
}

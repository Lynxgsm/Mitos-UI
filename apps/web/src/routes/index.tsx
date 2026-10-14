import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, Button } from "@omni/core/react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>Omni System UI</h1>
      <p>
        <Link to="/docs">Read the documentation</Link>
      </p>
      <Button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</Button>
      <Button variant="secondary" disabled>
        Disabled
      </Button>
      <Button variant="secondary" class="custom-button">
        Custom class
      </Button>
      <h2>FAQ</h2>
      <Accordion
        aria-label="FAQ"
        items={[
          { title: "Is it accessible?", content: "Native buttons with aria-expanded; collapsed panels are inert." },
          { title: "Is it animated?", content: "Panels open to their natural height, unless reduced motion is on." },
          { title: "Keyboard?", content: "Enter/Space toggles, arrows, Home and End move between headers." },
        ]}
      />
    </main>
  );
}

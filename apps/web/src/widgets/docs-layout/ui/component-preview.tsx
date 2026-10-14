import type { ComponentType } from "react";
import { CodeBlock } from "@/shared/ui/code-block";
import { Tabs } from "@/shared/ui/tabs";

export function ComponentPreview(props: { example: ComponentType; source: string; label: string }) {
  const Example = props.example;
  return (
    <Tabs
      label={props.label}
      tabs={[
        {
          label: "Preview",
          content: (
            // the real package defaults, not the site's brand theme
            <div className="docs-preview omni-default-theme">
              <Example />
            </div>
          ),
        },
        { label: "Code", content: <CodeBlock code={props.source} label={`${props.label} source`} /> },
      ]}
    />
  );
}

import type { ComponentType } from "react";
import { FrameworkCode } from "@/features/select-framework";
import { Tabs } from "@/shared/ui/tabs";

export function BlockPreview(props: {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
  source: string;
  svelteSource: string;
}) {
  const Block = props.Component;
  return (
    <section className="blocks-item" aria-labelledby={`block-${props.id}`}>
      <div className="blocks-item-header">
        <h3 id={`block-${props.id}`}>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      <Tabs
        label={`${props.title}: preview or code`}
        tabs={[
          {
            label: "Preview",
            content: (
              // the package defaults, not the site brand theme
              <div className="blocks-frame omni-default-theme">
                <Block />
              </div>
            ),
          },
          {
            label: "Code",
            content: <FrameworkCode label={`${props.title} source`} react={props.source} svelte={props.svelteSource} />,
          },
        ]}
      />
    </section>
  );
}

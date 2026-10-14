import { FRAMEWORKS, setFramework, useFramework } from "@/entities/framework";
import { CodeBlock } from "@/shared/ui/code-block";
import { Tabs } from "@/shared/ui/tabs";

// Same snippet in each framework's syntax; picking a framework switches every such block on the site.
export function FrameworkCode(props: { label: string; react: string; svelte: string }) {
  const framework = useFramework();
  return (
    <Tabs
      label={`${props.label}: framework`}
      selected={FRAMEWORKS.findIndex((entry) => entry.id === framework)}
      onSelect={(index) => setFramework(FRAMEWORKS[index]!.id)}
      tabs={FRAMEWORKS.map(({ id, name, Logo }) => ({
        label: name,
        icon: <Logo />,
        content: (
          <CodeBlock
            code={props[id]}
            label={`${props.label} (${name})`}
            language={id === "svelte" ? "svelte" : "tsx"}
          />
        ),
      }))}
    />
  );
}

import { CodeBlock } from "@/shared/ui/code-block";
import { Tabs } from "@/shared/ui/tabs";

const PACKAGE_MANAGERS = [
  ["bun", "bun add"],
  ["npm", "npm install"],
  ["pnpm", "pnpm add"],
  ["yarn", "yarn add"],
] as const;

export function InstallCommand(props: { packages: string }) {
  return (
    <Tabs
      label="Package manager"
      tabs={PACKAGE_MANAGERS.map(([name, command]) => ({
        label: name,
        content: <CodeBlock code={`${command} ${props.packages}`} label={`${name} install command`} language="bash" />,
      }))}
    />
  );
}

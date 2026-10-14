import { FRAMEWORKS, setFramework, useFramework } from "@/entities/framework";
import { PropsTable } from "@/shared/ui/props-table";
import { Tabs } from "@/shared/ui/tabs";
import { propsFor, type FrameworkPropRow } from "../model/props-for";

// The API reference in each framework's terms; switches with every other framework tab on the site.
export function FrameworkPropsTable(props: { component: string; rows: FrameworkPropRow[] }) {
  const framework = useFramework();
  return (
    <Tabs
      label={`${props.component} API: framework`}
      selected={FRAMEWORKS.findIndex((entry) => entry.id === framework)}
      onSelect={(index) => setFramework(FRAMEWORKS[index]!.id)}
      tabs={FRAMEWORKS.map(({ id, name, Logo }) => ({
        label: name,
        icon: <Logo />,
        content: <PropsTable component={`${props.component} (${name})`} rows={propsFor(id, props.rows)} />,
      }))}
    />
  );
}

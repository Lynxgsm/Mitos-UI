import { Tabs } from "mitos-ui/react";

export default function TabsVertical() {
  return (
    <Tabs
      label="Project"
      orientation="vertical"
      items={[
        { value: "overview", label: "Overview", content: "Activity and key numbers." },
        { value: "members", label: "Members", content: "People with access to this project." },
        { value: "archive", label: "Archive", content: "Archived items.", disabled: true },
      ]}
    />
  );
}

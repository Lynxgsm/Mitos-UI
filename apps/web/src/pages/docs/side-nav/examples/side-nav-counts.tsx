import { SideNav } from "mitos-ui/react";

const icon = (path: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d={path} />
  </svg>
);

export default function SideNavCounts() {
  return (
    <div style={{ maxWidth: "16rem" }}>
      <SideNav
        label="Main"
        currentHref="#library"
        groups={[
          {
            title: "Library",
            items: [
              { label: "Knowledge base", href: "#library", icon: icon("M4 4v16M8 8v12M12 6v14M16 6l4 14"), count: 9 },
              { label: "Alerts", href: "#alerts", icon: icon("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"), count: 2, countLabel: "unread", highlightCount: true },
            ],
          },
        ]}
      />
    </div>
  );
}

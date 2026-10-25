import { Select } from "mitos-ui/react";

const globeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function SelectIcon() {
  return (
    <div style={{ maxWidth: "12rem" }}>
      <Select
        label="Language"
        hideLabel
        startIcon={globeIcon}
        defaultValue="en"
        options={[
          { value: "en", label: "English" },
          { value: "fr", label: "Français" },
        ]}
      />
    </div>
  );
}

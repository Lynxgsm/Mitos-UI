import { Input } from "mitos-ui/react";

const searchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function InputAdornments() {
  // the label stays the accessible name: hideLabel only removes it from sight
  return (
    <div style={{ maxWidth: "24rem" }}>
      <Input
        label="Search"
        hideLabel
        type="search"
        placeholder="Search by name, tag or description"
        startIcon={searchIcon}
        endSlot={<kbd>/</kbd>}
      />
    </div>
  );
}

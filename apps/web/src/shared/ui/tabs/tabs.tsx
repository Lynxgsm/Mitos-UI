import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// APG tabs with automatic activation: one tab stop, arrows/Home/End move and select.
// Controlled when `selected`/`onSelect` are given (tabs that share one choice across the site).
export function Tabs(props: {
  label: string;
  tabs: { label: string; icon?: ReactNode; content: ReactNode }[];
  selected?: number;
  onSelect?: (index: number) => void;
}) {
  const [ownSelected, setOwnSelected] = useState(0);
  const selected = props.selected ?? ownSelected;
  const setSelected = props.onSelect ?? setOwnSelected;
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent) {
    const last = props.tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (selected === last ? 0 : selected + 1)
      : event.key === "ArrowLeft" ? (selected === 0 ? last : selected - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={props.label} className="tabs-list">
        {props.tabs.map((tab, index) => (
          <button
            key={tab.label}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={onKeyDown}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {props.tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

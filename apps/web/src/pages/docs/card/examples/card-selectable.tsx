import { Card, Checkbox } from "mitos-ui/react";

// The checkbox shows on hover, but also on keyboard focus, once checked, and always on touch screens:
// hiding it from those users would hide the action itself.
const CSS = `
.selectable-card { position: relative; width: 100%; max-width: 24rem; }
.selectable-card-check {
  position: absolute; top: 1.25rem; right: 1.25rem;
  opacity: 0; transition: opacity 0.15s ease;
}
.selectable-card:hover .selectable-card-check,
.selectable-card:focus-within .selectable-card-check,
.selectable-card:has(:checked) .selectable-card-check { opacity: 1; }
.selectable-card:has(:checked) .selectable-card-surface { border-color: var(--mitos-ring); box-shadow: 0 0 0 1px var(--mitos-ring); }
@media (hover: none) { .selectable-card-check { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .selectable-card-check { transition: none; } }
`;

export default function CardSelectable() {
  return (
    <div className="selectable-card">
      <style href="card-selectable" precedence="default">
        {CSS}
      </style>
      <Card class="selectable-card-surface" title="Q3 report" description="Edited 2 hours ago by Inès.">
        <p style={{ margin: 0 }}>Revenue, churn and the roadmap for next quarter.</p>
      </Card>
      {/* hideLabel keeps the name for screen readers: the box alone would be "checkbox, not checked" */}
      <Checkbox class="selectable-card-check" label="Select Q3 report" hideLabel />
    </div>
  );
}

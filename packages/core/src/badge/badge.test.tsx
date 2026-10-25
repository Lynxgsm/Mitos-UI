/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Badge from "@/badge/badge";

afterEach(cleanup);

const VARIANTS = ["default", "secondary", "outline", "destructive", "accent", "destructive-outline"] as const;

describe("Badge", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </p>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("renders its text as plain inline content, without a role", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("role")).toBeNull();
  });

  it("applies distinct styles to every variant", () => {
    render(<>{VARIANTS.map((variant) => <Badge key={variant} variant={variant}>{variant}</Badge>)}</>);
    const classNames = VARIANTS.map((variant) => screen.getByText(variant).className);
    expect(new Set(classNames).size).toBe(VARIANTS.length);
  });

  it("defaults to the default variant", () => {
    render(
      <>
        <Badge>implicit</Badge>
        <Badge variant="default">explicit</Badge>
      </>,
    );
    expect(screen.getByText("implicit").className).toBe(screen.getByText("explicit").className);
  });

  it("merges a custom class with its own styles", () => {
    render(<Badge class="custom">New</Badge>);
    const classes = screen.getByText("New").classList;
    expect(classes.contains("custom")).toBe(true);
    expect(classes.length).toBeGreaterThan(1);
  });

  it("forwards ARIA, data and native attributes, without leaking its own props", () => {
    render(
      <Badge variant="outline" id="status" title="Build status" data-state="passing" aria-label="Build passing">
        Passing
      </Badge>,
    );
    const badge = screen.getByText("Passing");
    expect(badge.id).toBe("status");
    expect(badge.title).toBe("Build status");
    expect(badge.dataset.state).toBe("passing");
    expect(badge.getAttribute("aria-label")).toBe("Build passing");
    expect(badge.hasAttribute("variant")).toBe(false);
  });
});

/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import Skeleton from "@/skeleton/skeleton";

afterEach(cleanup);

describe("Skeleton", () => {
  it("has no axe violations inside a busy container", async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Profile">
        <Skeleton />
        <Skeleton />
      </section>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is hidden from assistive technologies", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild!.getAttribute("aria-hidden")).toBe("true");
  });

  it("merges a custom class for its size and shape, and forwards attributes", () => {
    const { container } = render(<Skeleton class="custom" id="line" data-part="title" />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.classList.contains("custom")).toBe(true);
    expect(skeleton.classList.length).toBeGreaterThan(1);
    expect(skeleton.id).toBe("line");
    expect(skeleton.dataset.part).toBe("title");
  });
});

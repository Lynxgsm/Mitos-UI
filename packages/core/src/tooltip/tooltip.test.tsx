/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Tooltip from "@/tooltip/tooltip";
import Button from "@/button/button";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderTooltip = () =>
  render(
    <Tooltip content="Copy to clipboard" id="copy-tip">
      <Button aria-label="Copy">⧉</Button>
    </Tooltip>,
  );
const tooltip = () => document.getElementById("copy-tip")!;

// jsdom has no layout: stub the viewport, the rect of the trigger wrapper and the size of the popup
function stubLayout(anchor: { top: number; left: number; width: number; height: number }, popup: { width: number; height: number }) {
  const restore = [
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(800),
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(600),
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      ...anchor,
      right: anchor.left + anchor.width,
      bottom: anchor.top + anchor.height,
      x: anchor.left,
      y: anchor.top,
      toJSON: () => ({}),
    }),
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(popup.width),
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(popup.height),
  ];
  return () => restore.forEach((spy) => spy.mockRestore());
}


describe("Tooltip", () => {
  it("has no axe violations", async () => {
    vi.useRealTimers();
    const { container } = renderTooltip();
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("describes its trigger", () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Copy" });
    expect(trigger.getAttribute("aria-describedby")).toBe("copy-tip");
    expect(tooltip().getAttribute("role")).toBe("tooltip");
    expect(tooltip().textContent).toBe("Copy to clipboard");
  });

  it("shows on focus right away and hides on blur", () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Copy" });
    act(() => {
      fireEvent.focus(trigger);
      vi.runAllTimers();
    });
    expect(tooltip().hidden).toBe(false);
    act(() => {
      fireEvent.blur(trigger);
      vi.runAllTimers();
    });
    expect(tooltip().hidden).toBe(true);
  });

  it("shows on hover after a delay", () => {
    renderTooltip();
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copy" }).parentElement!);
    act(() => vi.advanceTimersByTime(200));
    expect(tooltip().hidden).toBe(true);
    act(() => vi.advanceTimersByTime(200));
    expect(tooltip().hidden).toBe(false);
  });

  it("stays open while the pointer moves onto it, closes when it leaves", () => {
    renderTooltip();
    const root = screen.getByRole("button", { name: "Copy" }).parentElement!;
    fireEvent.mouseEnter(root);
    act(() => vi.runAllTimers());
    fireEvent.mouseLeave(root);
    act(() => vi.advanceTimersByTime(50));
    fireEvent.mouseEnter(root);
    act(() => vi.runAllTimers());
    expect(tooltip().hidden).toBe(false);
    fireEvent.mouseLeave(root);
    act(() => vi.runAllTimers());
    expect(tooltip().hidden).toBe(true);
  });

  it("closes on Escape without moving the focus", () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Copy" });
    trigger.focus();
    act(() => vi.runAllTimers());
    expect(tooltip().hidden).toBe(false);
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
      vi.runAllTimers();
    });
    expect(tooltip().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("forwards attributes to its wrapper, without leaking its own props", () => {
    const { container } = render(
      <Tooltip content="Hint" class="custom" data-hint="copy">
        <Button>Copy</Button>
      </Tooltip>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.hint).toBe("copy");
    expect(root.classList.contains("custom")).toBe(true);
    expect(root.hasAttribute("content")).toBe(false);
  });

  it("flips below when there is no room above, and shifts to stay inside the viewport", () => {
    const restore = stubLayout({ top: 4, left: 2, width: 32, height: 32 }, { width: 120, height: 30 });
    try {
      renderTooltip();
      act(() => {
        fireEvent.focus(screen.getByRole("button", { name: "Copy" }));
        vi.runAllTimers();
      });
      expect(tooltip().dataset.side).toBe("bottom");
      // centered on the trigger it would start at 18 - 60 = -42px: moved right to the 8px margin
      expect(tooltip().style.getPropertyValue("--mitos-tooltip-shift")).toBe("50px");
      expect(tooltip().style.visibility).toBe("");
    } finally {
      restore();
    }
  });

  it("keeps its preferred side when it fits", () => {
    const restore = stubLayout({ top: 300, left: 380, width: 40, height: 32 }, { width: 120, height: 30 });
    try {
      renderTooltip();
      act(() => {
        fireEvent.focus(screen.getByRole("button", { name: "Copy" }));
        vi.runAllTimers();
      });
      expect(tooltip().dataset.side).toBe("top");
      expect(tooltip().style.getPropertyValue("--mitos-tooltip-shift")).toBe("0px");
    } finally {
      restore();
    }
  });
});

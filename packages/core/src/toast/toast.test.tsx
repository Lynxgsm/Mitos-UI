/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import Toaster from "@/toast/toaster";
import { DEFAULT_TOAST_DURATION, dismissAllToasts, toast, type ToastOptions } from "@/toast/toast-store";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  act(() => dismissAllToasts());
  cleanup();
  vi.useRealTimers();
});

const show = (options: ToastOptions) => act(() => void toast(options));
const wait = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const region = () => screen.getByRole("region", { name: "Notifications" });
// visible toasts only: the hidden live regions keep the last announcement on purpose
const visible = () => within(region()).getByRole("list").textContent;

describe("Toaster", () => {
  it("has no axe violations", async () => {
    vi.useRealTimers(); // axe schedules its own timers
    const { container } = render(<Toaster />);
    show({ title: "Saved", description: "Your profile is up to date." });
    show({ title: "Upload failed", variant: "destructive", action: { label: "Retry", onClick: () => {} } });
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("keeps empty live regions in place before any toast", () => {
    render(<Toaster />);
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.getByRole("alert").textContent).toBe("");
  });

  it("shows a toast and announces it politely", () => {
    render(<Toaster />);
    show({ title: "Saved", description: "Your profile is up to date." });
    expect(visible()).toContain("Saved");
    expect(screen.getByRole("status").textContent).toBe("Saved. Your profile is up to date.");
    expect(screen.getByRole("alert").textContent).toBe("");
  });

  it("announces destructive toasts assertively", () => {
    render(<Toaster />);
    show({ title: "Upload failed", variant: "destructive" });
    expect(screen.getByRole("alert").textContent).toBe("Upload failed");
  });

  it("announces an identical message again", () => {
    render(<Toaster />);
    show({ title: "Copied" });
    const first = screen.getByRole("status").textContent;
    show({ title: "Copied" });
    expect(screen.getByRole("status").textContent).not.toBe(first);
  });

  it("announces each toast once", () => {
    render(<Toaster />);
    show({ title: "First" });
    show({ title: "Second" });
    expect(screen.getByRole("status").textContent).toBe("Second");
  });

  it("does not steal focus", () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <Toaster />
      </>,
    );
    const elsewhere = screen.getByRole("button", { name: "Elsewhere" });
    elsewhere.focus();
    show({ title: "Saved" });
    expect(document.activeElement).toBe(elsewhere);
  });

  it("dismisses itself after the default duration", () => {
    render(<Toaster />);
    show({ title: "Saved" });
    wait(DEFAULT_TOAST_DURATION - 1);
    expect(visible()).toContain("Saved");
    wait(1);
    expect(visible()).not.toContain("Saved");
  });

  it("pauses while hovered or focused, then resumes with the remaining time", () => {
    render(<Toaster />);
    show({ title: "Saved" });
    wait(3000);
    fireEvent.mouseEnter(region());
    wait(10_000);
    expect(visible()).toContain("Saved");
    fireEvent.mouseLeave(region());
    wait(1999);
    expect(visible()).toContain("Saved");
    wait(1);
    expect(visible()).not.toContain("Saved");

    show({ title: "Focused" });
    fireEvent.focus(screen.getByRole("button", { name: "Dismiss notification" }));
    wait(10_000);
    expect(visible()).toContain("Focused");
  });

  it("never auto-dismisses a toast that has an action", () => {
    const onClick = vi.fn();
    render(<Toaster />);
    show({ title: "Message archived", action: { label: "Undo", onClick } });
    wait(60_000);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(visible()).not.toContain("Message archived");
  });

  it("keeps a toast with an infinite duration until dismissed", () => {
    render(<Toaster />);
    show({ title: "Offline", duration: Infinity });
    wait(60_000);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(visible()).not.toContain("Offline");
  });

  it("forwards ARIA, data and native attributes, and accepts a custom label", () => {
    render(<Toaster label="Alerts" data-position="bottom-right" class="custom" />);
    const section = screen.getByRole("region", { name: "Alerts" });
    expect(section.dataset.position).toBe("bottom-right");
    expect(section.classList.contains("custom")).toBe(true);
    expect(section.hasAttribute("label")).toBe(false);
  });
});

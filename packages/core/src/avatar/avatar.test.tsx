/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Avatar from "@/avatar/avatar";

afterEach(cleanup);

const SRC = "https://example.com/ada.png";

describe("Avatar", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Avatar src={SRC} alt="Ada Lovelace" />
        <Avatar alt="Grace Hopper" />
        <p>
          <Avatar alt="" /> Alan Turing
        </p>
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("renders the image with its alt text as accessible name", () => {
    render(<Avatar src={SRC} alt="Ada Lovelace" />);
    const image = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(image.tagName).toBe("IMG");
    expect(image.getAttribute("src")).toBe(SRC);
  });

  it("falls back to initials, with the same accessible name, when there is no image", () => {
    render(<Avatar alt="Ada King Lovelace" />);
    const fallback = screen.getByRole("img", { name: "Ada King Lovelace" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback.textContent).toBe("AL");
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src={SRC} alt="Ada Lovelace" />);
    fireEvent.error(screen.getByRole("img"));
    const fallback = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback.textContent).toBe("AL");
  });

  it("detects an image that failed before mount (server-rendered, error fired before hydration)", () => {
    const complete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "complete")!;
    Object.defineProperty(HTMLImageElement.prototype, "complete", { configurable: true, get: () => true });
    try {
      render(<Avatar src={SRC} alt="Ada Lovelace" />);
      expect(screen.getByRole("img", { name: "Ada Lovelace" }).tagName).toBe("SPAN");
    } finally {
      Object.defineProperty(HTMLImageElement.prototype, "complete", complete);
    }
  });

  it("tries a new src again after a failure", () => {
    const { rerender } = render(<Avatar src={SRC} alt="Ada Lovelace" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<Avatar src="https://example.com/ada-2.png" alt="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).tagName).toBe("IMG");
  });

  it("uses an explicit fallback over the initials", () => {
    render(<Avatar alt="Ada Lovelace" fallback="A" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).textContent).toBe("A");
  });

  it("is hidden from assistive technologies when alt is empty", () => {
    const { container } = render(<Avatar alt="" fallback="AT" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe("AT");
  });

  it("applies distinct styles to every size and defaults to md", () => {
    const { container } = render(
      <>
        {(["sm", "md", "lg"] as const).map((size) => <Avatar key={size} alt="Ada" size={size} />)}
        <Avatar alt="Ada" />
      </>,
    );
    const [sm, md, lg, implicit] = Array.from(container.children).map((element) => element.className);
    expect(new Set([sm, md, lg]).size).toBe(3);
    expect(implicit).toBe(md);
  });

  it("forwards ARIA, data and native attributes, without leaking its own props", () => {
    const { container } = render(
      <Avatar alt="Ada" size="lg" class="custom" id="author" title="Author" data-status="online" aria-describedby="bio" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe("author");
    expect(root.title).toBe("Author");
    expect(root.dataset.status).toBe("online");
    expect(root.getAttribute("aria-describedby")).toBe("bio");
    expect(root.classList.contains("custom")).toBe(true);
    expect(root.hasAttribute("size")).toBe(false);
    expect(root.hasAttribute("alt")).toBe(false);
    expect(root.hasAttribute("fallback")).toBe(false);
  });
});

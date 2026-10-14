/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Textarea from "@/textarea/textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Textarea label="Bio" description="Shown on your public profile." />
        <Textarea label="Message" error="Please write a message." required />
        <Textarea label="Notes" disabled />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a multi-line textbox named by its label, 3 rows by default", () => {
    render(<Textarea label="Bio" />);
    const field = screen.getByRole("textbox", { name: "Bio" }) as HTMLTextAreaElement;
    expect(field.tagName).toBe("TEXTAREA");
    expect(field.rows).toBe(3);
  });

  it("accepts a row count", () => {
    render(<Textarea label="Bio" rows={6} />);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).rows).toBe(6);
  });

  it("links its error and description, error first", () => {
    render(<Textarea id="bio" label="Bio" description="Max 160 characters." error="Too long." />);
    const field = screen.getByRole("textbox");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(field.getAttribute("aria-describedby")).toBe("bio-error bio-description");
  });

  it("forwards native attributes and change events", () => {
    let value = "";
    render(<Textarea label="Bio" name="bio" maxLength={160} required onChange={(event) => (value = event.target.value)} />);
    const field = screen.getByRole("textbox", { name: "Bio" }) as HTMLTextAreaElement;
    expect(field.getAttribute("name")).toBe("bio");
    expect(field.maxLength).toBe(160);
    expect(field.required).toBe(true);
    fireEvent.change(field, { target: { value: "Designer" } });
    expect(value).toBe("Designer");
    for (const prop of ["label", "description", "error"]) expect(field.hasAttribute(prop)).toBe(false);
  });

  it("is disabled", () => {
    render(<Textarea label="Notes" disabled />);
    expect((screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement).disabled).toBe(true);
  });
});

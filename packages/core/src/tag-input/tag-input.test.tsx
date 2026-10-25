/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import axe from "axe-core";
import TagInput from "@/tag-input/tag-input";

afterEach(cleanup);

const field = () => screen.getByRole("textbox", { name: "Personal tags" });
const typeAndPress = (text: string, key: string) => {
  fireEvent.change(field(), { target: { value: text } });
  (field() as HTMLInputElement).value = text;
  fireEvent.keyDown(field(), { key });
};

describe("TagInput", () => {
  it("has no axe violations, empty and with tags, description and error", async () => {
    const { container } = render(
      <>
        <TagInput id="empty" label="Personal tags" />
        <TagInput id="full" label="Other tags" defaultValue={["forms", "api-input"]} description="Press Enter to add." error="Too many tags." />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a text field named by its label, listing its tags with named remove buttons", () => {
    render(<TagInput id="tags" label="Personal tags" defaultValue={["forms", "api-input"]} />);
    expect(field().getAttribute("type")).toBe("text");
    expect(screen.getByRole("list", { name: "Personal tags" }).querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Remove forms" })).toBeTruthy();
  });

  it("adds a trimmed tag on Enter or comma, once, never empty", () => {
    const onValueChange = vi.fn();
    render(<TagInput id="tags" label="Personal tags" defaultValue={["forms"]} onValueChange={onValueChange} />);
    typeAndPress("  api-input ", "Enter");
    expect(onValueChange).toHaveBeenLastCalledWith(["forms", "api-input"]);
    expect((field() as HTMLInputElement).value).toBe("");
    typeAndPress("to-try", ",");
    expect(onValueChange).toHaveBeenLastCalledWith(["forms", "api-input", "to-try"]);
    typeAndPress("forms", "Enter");
    typeAndPress("   ", "Enter");
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("removes a tag with its button, giving the focus back to the field, and the last one with Backspace", () => {
    render(<TagInput id="tags" label="Personal tags" defaultValue={["forms", "api-input", "to-try"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove api-input" }));
    expect(screen.queryByRole("button", { name: "Remove api-input" })).toBeNull();
    expect(document.activeElement).toBe(field());
    fireEvent.keyDown(field(), { key: "Backspace" });
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["forms"]);
  });

  it("turns the text left in the field into a tag when it loses the focus", () => {
    const onValueChange = vi.fn();
    render(<TagInput id="tags" label="Personal tags" onValueChange={onValueChange} />);
    (field() as HTMLInputElement).value = "side-project";
    fireEvent.blur(field());
    expect(onValueChange).toHaveBeenLastCalledWith(["side-project"]);
  });

  it("follows value when controlled", () => {
    function Controlled() {
      const [tags, setTags] = useState(["forms"]);
      return <TagInput id="tags" label="Personal tags" value={tags} onValueChange={setTags} />;
    }
    render(<Controlled />);
    typeAndPress("api-input", "Enter");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["forms", "api-input"]);
  });

  it("submits the tags joined by commas under its name", () => {
    const { container } = render(<TagInput id="tags" label="Personal tags" name="tags" defaultValue={["forms", "to-try"]} />);
    expect((container.querySelector('input[type="hidden"][name="tags"]') as HTMLInputElement).value).toBe("forms,to-try");
  });

  it("translates the remove buttons and keeps a hidden label as the name", () => {
    render(<TagInput id="tags" label="Personal tags" hideLabel removeLabel={(tag) => `Retirer ${tag}`} defaultValue={["forms"]} />);
    expect(field()).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retirer forms" })).toBeTruthy();
  });

  it("links its description and error, error first, and disables everything", () => {
    render(<TagInput id="tags" label="Personal tags" description="Help" error="Wrong" disabled defaultValue={["forms"]} />);
    expect(field().getAttribute("aria-describedby")).toBe("tags-error tags-description");
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect((field() as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Remove forms" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("forwards native attributes to the text field, without leaking its own props", () => {
    render(<TagInput id="tags" label="Personal tags" placeholder="Add a tag" data-testid="tags" class="custom" removeLabel={(tag) => tag} />);
    const input = screen.getByTestId("tags");
    expect(input).toBe(field());
    expect(input.getAttribute("placeholder")).toBe("Add a tag");
    for (const prop of ["label", "removelabel", "defaultvalue", "onvaluechange"]) expect(input.hasAttribute(prop)).toBe(false);
    // class styles the whole field, not the text input inside it
    expect(input.classList.contains("custom")).toBe(false);
    expect(input.closest(".custom")).not.toBeNull();
  });
});

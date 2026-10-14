/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Button from "../../output/react/src/button/button";

afterEach(cleanup);

describe("Button", () => {
  it("renders its children as an accessible button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("forwards an explicit type", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button") as HTMLButtonElement;
    fireEvent.click(button);
    expect(button.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom class with its own styles", () => {
    render(<Button class="custom">Save</Button>);
    const classes = screen.getByRole("button").classList;
    expect(classes.contains("custom")).toBe(true);
    expect(classes.length).toBeGreaterThan(1);
  });

  it("applies different styles per variant", () => {
    render(
      <>
        <Button>A</Button>
        <Button variant="secondary">B</Button>
      </>,
    );
    const [a, b] = screen.getAllByRole("button");
    expect(a!.className).not.toBe(b!.className);
  });
});

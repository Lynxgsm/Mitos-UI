/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import axe from "axe-core";
import Dialog, { type DialogProps } from "@/dialog/dialog";
import Input from "@/input/input";

// jsdom does not implement the modal dialog API: emulate its observable effects
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(cleanup);

function Harness(props: Partial<DialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit profile"
        description="Update your public details."
        footer={
          <button type="button" onClick={() => setOpen(false)}>
            Save
          </button>
        }
        {...props}
      >
        <Input label="Name" />
      </Dialog>
    </>
  );
}

const openDialog = () => {
  const trigger = screen.getByRole("button", { name: "Open" });
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
};

const cancel = (dialog: HTMLElement) => fireEvent(dialog, new Event("cancel", { cancelable: true }));

describe("Dialog", () => {
  it("has no axe violations when open", async () => {
    const { container } = render(<Harness />);
    openDialog();
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is closed until opened", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens as a modal named by its title and described by its description", () => {
    render(<Harness />);
    openDialog();
    const dialog = screen.getByRole("dialog", { name: "Edit profile" });
    expect(dialog.tagName).toBe("DIALOG");
    expect(document.getElementById(dialog.getAttribute("aria-describedby")!)!.textContent).toBe(
      "Update your public details.",
    );
  });

  it("moves focus inside on open", () => {
    render(<Harness />);
    openDialog();
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape and restores focus to the trigger", () => {
    render(<Harness />);
    const trigger = openDialog();
    cancel(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes from the close button and from footer actions", () => {
    render(<Harness />);
    const trigger = openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);

    openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays open on Escape when the parent keeps it open (controlled)", () => {
    const onClose = vi.fn();
    render(<Dialog open title="Locked" onClose={onClose} />);
    cancel(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "Locked" })).toBeTruthy();
  });

  it("renders an alertdialog without a close button, focusing the first action", () => {
    render(
      <Dialog
        open
        alert
        title="Delete project?"
        description="This cannot be undone."
        footer={
          <>
            <button type="button">Cancel</button>
            <button type="button">Delete project</button>
          </>
        }
      />,
    );
    const dialog = screen.getByRole("alertdialog", { name: "Delete project?" });
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
  });

  it("derives stable ids from the `id` prop", () => {
    render(<Dialog open id="profile" title="Edit profile" description="Details" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby")).toBe("profile-title");
    expect(dialog.getAttribute("aria-describedby")).toBe("profile-description");
  });

  it("forwards ARIA, data and native attributes, without leaking its own props", () => {
    render(<Dialog open title="Edit profile" data-state="ready" aria-modal="true" class="custom" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.dataset.state).toBe("ready");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.classList.contains("custom")).toBe(true);
    for (const prop of ["title", "description", "footer", "alert"]) expect(dialog.hasAttribute(prop)).toBe(false);
  });
});

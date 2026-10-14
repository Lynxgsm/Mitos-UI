/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import axe from "axe-core";
import RadioGroup from "@/radio-group/radio-group";

afterEach(cleanup);

const PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team", disabled: true },
];

describe("RadioGroup", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <RadioGroup legend="Plan" name="plan" options={PLANS} defaultValue="pro" description="Change it anytime." />
        <RadioGroup legend="Billing" name="billing" options={PLANS} required error="Choose a billing period." />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a radio group named by its legend, with one native radio per option", () => {
    render(<RadioGroup legend="Plan" name="plan" options={PLANS} defaultValue="pro" />);
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(group.contains(radios[0]!)).toBe(true);
    expect(radios.map((radio) => radio.name)).toEqual(["plan", "plan", "plan"]);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
    expect(screen.getByRole("radio", { name: "Team" })).toHaveProperty("disabled", true);
  });

  it("selects one option at a time and reports changes on the group", () => {
    const onChange = vi.fn();
    render(<RadioGroup legend="Plan" name="plan" options={PLANS} defaultValue="pro" onChange={onChange} />);
    fireEvent.click(screen.getByText("Free"));
    expect(screen.getByRole("radio", { name: "Free" })).toHaveProperty("checked", true);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", false);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target.value).toBe("free");
  });

  it("follows a controlled value, set by the parent from onChange", () => {
    function Controlled() {
      const [plan, setPlan] = useState("pro");
      return (
        <>
          <RadioGroup legend="Plan" name="plan" options={PLANS} value={plan} onChange={(event: any) => setPlan(event.target.value)} />
          <button type="button" onClick={() => setPlan("free")}>
            Reset
          </button>
          <output>{plan}</output>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(screen.getByRole("status").textContent).toBe("free");
    fireEvent.click(screen.getByRole("radio", { name: "Pro" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "Free" })).toHaveProperty("checked", true);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", false);
  });

  it("keeps a controlled value when the parent refuses the change", () => {
    const onChange = vi.fn();
    render(<RadioGroup legend="Plan" name="plan" options={PLANS} value="pro" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
    expect(screen.getByRole("radio", { name: "Free" })).toHaveProperty("checked", false);
  });

  it("exposes required, invalid and the help texts on the group", () => {
    render(
      <RadioGroup id="plan" legend="Plan" name="plan" options={PLANS} required error="Pick one." description="Monthly." />,
    );
    const group = screen.getByRole("radiogroup", { name: /Plan/ });
    expect(group.getAttribute("aria-required")).toBe("true");
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.getAttribute("aria-describedby")).toBe("plan-error plan-description");
    expect((screen.getAllByRole("radio")[0] as HTMLInputElement).required).toBe(true);
  });

  it("disables every option at once", () => {
    render(<RadioGroup legend="Plan" name="plan" options={PLANS} disabled />);
    expect((screen.getByRole("radiogroup") as HTMLFieldSetElement).disabled).toBe(true);
  });

  it("forwards attributes to the fieldset, without leaking its own props", () => {
    render(<RadioGroup legend="Plan" name="plan" options={PLANS} class="custom" data-step="2" />);
    const group = screen.getByRole("radiogroup");
    expect(group.dataset.step).toBe("2");
    expect(group.classList.contains("custom")).toBe(true);
    expect(group.hasAttribute("options")).toBe(false);
    expect(group.hasAttribute("name")).toBe(false);
  });
});

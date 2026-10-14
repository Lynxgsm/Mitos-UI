/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Button from "@/button/button";
import Dialog, { type DialogProps } from "@/dialog/dialog";
import Input from "@/input/input";

function Demo(props: DialogProps & { trigger: string; confirm: string }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    props.onClose?.();
    setOpen(false);
  };
  return (
    <>
      <Button variant={props.alert ? "destructive" : "default"} onClick={() => setOpen(true)}>
        {props.trigger}
      </Button>
      <Dialog
        {...props}
        open={open}
        onClose={close}
        footer={
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button variant={props.alert ? "destructive" : "default"} onClick={close}>
              {props.confirm}
            </Button>
          </>
        }
      />
    </>
  );
}

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  render: (args) => <Demo {...(args as DialogProps & { trigger: string; confirm: string })} />,
  args: {
    open: false,
    onClose: fn(),
    title: "Edit profile",
    description: "Update your public details. Changes are saved when you click Save.",
    trigger: "Edit profile",
    confirm: "Save",
  } as DialogProps & { trigger: string; confirm: string },
  argTypes: {
    alert: { control: "boolean" },
    open: { control: false },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Input label="Display name" defaultValue="Inès Moreau" autoComplete="name" />,
  },
};

export const Alert: Story = {
  args: {
    alert: true,
    title: "Delete project?",
    description: "This permanently removes the project and its themes. You cannot undo it.",
    trigger: "Delete project",
    confirm: "Delete project",
  } as DialogProps & { trigger: string; confirm: string },
};

export const WithoutDescription: Story = {
  args: { description: undefined, children: <p style={{ margin: 0 }}>Plain content, no description.</p> },
};

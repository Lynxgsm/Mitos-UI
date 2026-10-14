/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/button/button";
import Toaster from "@/toast/toaster";
import { toast, type ToastOptions } from "@/toast/toast-store";

function Demo(props: { label: string; options: ToastOptions }) {
  return (
    <>
      <Button variant="outline" onClick={() => toast(props.options)}>
        {props.label}
      </Button>
      <Toaster />
    </>
  );
}

const meta = {
  title: "Components/Toast",
  component: Toaster,
  render: (args) => <Demo {...(args as unknown as { label: string; options: ToastOptions })} />,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Save changes", options: { title: "Changes saved", description: "Your profile is up to date." } } as never,
};

export const Destructive: Story = {
  args: {
    label: "Upload file",
    options: { title: "Upload failed", description: "The file is larger than 10 MB.", variant: "destructive" },
  } as never,
};

export const WithAction: Story = {
  args: {
    label: "Archive message",
    options: { title: "Message archived", action: { label: "Undo", onClick: () => toast({ title: "Message restored" }) } },
  } as never,
};

export const Persistent: Story = {
  args: { label: "Go offline", options: { title: "You are offline", duration: Infinity } } as never,
};

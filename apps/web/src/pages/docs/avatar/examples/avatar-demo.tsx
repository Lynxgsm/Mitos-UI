import { Avatar } from "mitos-ui/react";

export default function AvatarDemo() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Avatar src="https://github.com/shadcn.png" alt="shadcn" />
      <Avatar alt="Ada Lovelace" />
    </div>
  );
}

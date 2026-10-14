import { Avatar } from "mitos-ui/react";

export default function AvatarWithName() {
  return (
    <p style={{ display: "flex", gap: "0.75rem", alignItems: "center", margin: 0 }}>
      {/* the name is visible next to it: an empty alt keeps screen readers from saying it twice */}
      <Avatar src="https://github.com/shadcn.png" alt="" />
      <span>shadcn</span>
    </p>
  );
}

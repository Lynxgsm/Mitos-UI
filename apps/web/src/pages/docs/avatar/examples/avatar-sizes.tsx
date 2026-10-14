import { Avatar } from "@omni/core/react";

export default function AvatarSizes() {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Avatar alt="Grace Hopper" size="sm" />
      <Avatar alt="Grace Hopper" size="md" />
      <Avatar alt="Grace Hopper" size="lg" />
    </div>
  );
}

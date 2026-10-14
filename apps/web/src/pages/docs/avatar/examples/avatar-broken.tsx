import { Avatar } from "mitos-ui/react";

export default function AvatarBroken() {
  // the image fails to load: the initials take its place, with the same accessible name
  return <Avatar src="/missing-avatar.png" alt="Alan Turing" />;
}

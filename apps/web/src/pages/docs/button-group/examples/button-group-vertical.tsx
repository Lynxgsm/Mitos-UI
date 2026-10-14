import { Button, ButtonGroup } from "@lynxgsm/omni-ui/react";

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup aria-label="Zoom" orientation="vertical">
      <Button variant="outline" aria-label="Zoom in">+</Button>
      <Button variant="outline" aria-label="Zoom out">−</Button>
    </ButtonGroup>
  );
}

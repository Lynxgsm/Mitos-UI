import { useState } from "react";
import { Slider } from "mitos-ui/react";

export default function SliderDemo() {
  const [volume, setVolume] = useState(40);
  return (
    <div className="docs-example-field">
      <Slider
        label={`Volume: ${volume}%`}
        defaultValue={volume}
        aria-valuetext={`${volume} percent`}
        onInput={(event) => setVolume(Number(event.currentTarget.value))}
      />
    </div>
  );
}

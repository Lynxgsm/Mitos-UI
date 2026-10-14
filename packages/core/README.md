# mitos-ui

Accessible, themeable UI components written once with [Mitosis](https://mitosis.builder.io/) and styled with
[StyleX](https://stylexjs.com/), compiled for **React 19** and **Svelte 5**. One precompiled stylesheet, no bundler
plugin, WCAG AA contrast checked in CI.

## Install

```bash
npm install mitos-ui
```

## React

```tsx
import "mitos-ui/react/styles.css";
import { Button } from "mitos-ui/react";

export default function App() {
  return <Button>Click me</Button>;
}
```

## Svelte

```svelte
<script>
  import "mitos-ui/svelte/styles.css";
  import { Button } from "mitos-ui/svelte";
</script>

<Button>Click me</Button>
```

## Theming

Every color and radius is a `--mitos-*` CSS custom property. The library rules live in cascade layers, so any CSS you
write without layers overrides them, whatever the import order:

```css
:root {
  --mitos-primary: #1d4ed8;
  --mitos-radius-md: 0.75rem;
}
```

## Components

Accordion, Avatar, Badge, Button, ButtonGroup, Card, Checkbox, Dialog, Fieldset, Input, Menu, RadioGroup, Select,
SideNav, Skeleton, Slider, Switch, Tabs, Textarea, Toast (`Toaster`, `toast()`), Tooltip.

See [CHANGELOG.md](https://github.com/Lynxgsm/Mitos-UI/blob/main/CHANGELOG.md) for the history.

## License

MIT

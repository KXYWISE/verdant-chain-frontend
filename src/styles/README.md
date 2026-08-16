# src/styles

Global styles and the VerdAnt design-token system.

- `globals.css` — base/reset + the single import point for tokens.
- `tokens/` — CSS custom properties (design tokens): color, typography, spacing,
  shape, elevation, motion, layout. Imported once via `tokens/index.css`.

## Token usage

Consumers reference custom properties directly, e.g.:

```css
.myCard {
  background: var(--va-surface-container);
  color: var(--va-on-surface);
  border-radius: var(--va-shape-lg);
  box-shadow: var(--va-elevation-2);
}
```

Dark mode is automatic (`prefers-color-scheme`) and can be forced per-page with
`data-theme="dark"` or `data-theme="light"` on `<html>`.

Do not hard-code colors in components; always use semantic tokens. See
[`tokens/README.md`](tokens/README.md).

# Design tokens

CSS custom properties that define the VerdAnt visual language (Material 3
Expressive foundation, distinct agricultural identity).

| File             | Tokens                                        |
| ---------------- | --------------------------------------------- |
| `color.css`      | Brand scale + semantic roles (light & dark)   |
| `typography.css` | Type scale (display → label) and fonts        |
| `spacing.css`    | 4px-base spacing scale                        |
| `shape.css`      | Corner radii                                  |
| `elevation.css`  | Shadow levels (theme-aware)                   |
| `motion.css`     | Durations and easing curves                   |
| `layout.css`     | Containers, breakpoints, focus-ring, controls |

## Naming convention

Semantic tokens use `--va-<role>-<state>` (e.g. `--va-primary-container`,
`--va-on-surface`). Use semantic roles, not raw brand colors, in UI code.

## Theme switching

Light is the default in `:root`. Dark is applied automatically via
`@media (prefers-color-scheme: dark)` and can be pinned with
`data-theme="dark"` / `data-theme="light"` on the root `<html>` element.

## Adding tokens

Extend the relevant file; keep the light/dark pair together. Token changes are
part of the design-system contract — coordinate with other agents via
`docs/agent-notes/` when they affect shared rendering (e.g. on-chain status
colors).

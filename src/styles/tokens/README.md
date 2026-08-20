# Design tokens

CSS custom properties that define the VerdAnt visual language (Material 3
Expressive foundation, distinct agricultural identity).

| File             | Tokens                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `color.css`      | Brand scale + semantic roles (light & dark)                                              |
| `typography.css` | Type scale (display → label) and fonts                                                   |
| `spacing.css`    | 4px-base spacing scale                                                                   |
| `shape.css`      | Corner radii (incl. `--va-shape-2xl`)                                                    |
| `elevation.css`  | Shadow levels (theme-aware)                                                              |
| `motion.css`     | Durations and easing curves                                                              |
| `layout.css`     | Containers, breakpoints, container-query breakpoints (`--va-cq-*`), focus-ring, controls |

## Naming convention

Semantic tokens use `--va-<role>-<state>` (e.g. `--va-primary-container`,
`--va-on-surface`). Use semantic roles, not raw brand colors, in UI code.

## Responsive design (M3 Expressive)

- **Fluid type:** display/headline sizes use `clamp()` so they scale between
  mobile and desktop without explicit breakpoints.
- **Container queries:** the layout primitives (`Container` with `container`,
  `Card` with `container`, `Stack responsive`, `Grid responsive`) use
  `container-type: inline-size` and respond to their **containing block** width
  (breakpoints `--va-cq-*`), not the viewport. Prefer container queries for
  element-level responsiveness; use viewport media queries only for page-level
  layout.
- **Adaptive controls:** `Button block` becomes full-width in narrow
  containers; `Card` padding/radius grow with container width.
- Grid columns only ever **grow** as the container widens (`max()` with the
  requested base count).

## Theme switching

Light is the default in `:root`. Dark is applied automatically via
`@media (prefers-color-scheme: dark)` and can be pinned with
`data-theme="dark"` / `data-theme="light"` on the root `<html>` element.

## Adding tokens

Extend the relevant file; keep the light/dark pair together. Token changes are
part of the design-system contract — coordinate via `docs/agent-notes/` when
they affect shared rendering (e.g. on-chain status colors).

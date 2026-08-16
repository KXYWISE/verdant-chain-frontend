# verdant-frontend

Frontend for **VerdAnt** — open agricultural technology & financial infrastructure
built on Stellar/Soroban. See the coordination root
[`/home/astro/drips2.0/INSTRUCTIONS.md`](../INSTRUCTIONS.md) for the master
architecture.

## Stack

- Next.js (App Router) · React · TypeScript (strict)
- Material 3 Expressive foundation with a distinct VerdAnt identity — see
  [`src/styles/README.md`](src/styles/README.md) and the design-system route
  (`/design-system`)
- Plain CSS custom properties (design tokens) + CSS Modules; no utility CSS
- Testing: Vitest + React Testing Library (unit/component), Playwright (E2E)

## Ownership

Owned by **Agent #3 (Frontend Engineer)**. Primary repository is `verdant-frontend`.
Cross-repository interface contracts live in `docs/api/` at the coordination root;
changes to interfaces require an agent note in `docs/agent-notes/`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Development server                              |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve production build                          |
| `npm run lint`         | ESLint check                                    |
| `npm run format`       | Prettier write                                  |
| `npm run format:check` | Prettier check                                  |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)               |
| `npm test`             | Vitest (unit/component) run                     |
| `npm run test:watch`   | Vitest watch mode                               |
| `npm run test:e2e`     | Playwright E2E (needs `npx playwright install`) |

## Directory layout

```
src/
├── app/           # routes (App Router)
├── components/
│   └── ui/        # design-system primitives
├── styles/
│   ├── tokens/    # design tokens (CSS custom properties)
│   └── ...
├── lib/           # shared utilities
└── test/          # test setup
e2e/               # Playwright specs
```

## Definition of Done

Follows §16 of `INSTRUCTIONS.md`: meets documented interface contracts, includes
tests, passes lint/format/typecheck, no secrets, reuses shared primitives,
committed as small conventional changes.

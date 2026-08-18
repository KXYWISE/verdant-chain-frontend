# VerdAnt Frontend

Frontend for the **VerdAnt** ecosystem — open agricultural technology &
financial infrastructure built on Stellar/Soroban. This repository is owned by
**Agent #3 (Frontend Engineer)**.

It delivers the design system, the AgriScout discovery + farmer profile
surfaces, four feature landing pages (AgroProof, AgriLease, FarmFund,
LivestockPass), and the SEP-40 Freighter wallet-connect flow against the
VerdAnt backend.

## Table of contents

- [Stack](#stack)
- [Architecture overview](#architecture-overview)
- [Routes](#routes)
- [Design system & styling](#design-system--styling)
- [API & data layer](#api--data-layer)
- [Wallet & SEP-40 auth](#wallet--sep-40-auth)
- [Project layout](#project-layout)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Tests](#tests)
- [E2E](#e2e)
- [Definition of Done](#definition-of-done)

## Stack

- **Next.js (App Router)** · **React** · **TypeScript (strict)**
- **Material 3 Expressive** foundation with a distinct VerdAnt identity
  (AD-007) — design-system route at `/design-system`
- **Plain CSS custom properties** (design tokens) + CSS Modules; **no utility
  CSS** (coordination rule)
- Dark mode first-class via `prefers-color-scheme` + `data-theme` override
- Testing: **Vitest + React Testing Library** (unit/component), **Playwright**
  (E2E)
- API client with `localStorage` bearer-token persistence
- Wallet: `@stellar/freighter-api` (SEP-40 `signMessage`)

## Architecture overview

```
┌──────────────────────────────────────────────────────────────┐
│  Next.js App Router (src/app/)                                │
│   page.tsx            → home / pillar cards                   │
│   discover/           → AgriScout search grid (API)           │
│   farmers/[address]/  → farmer profile (API)                  │
│   verify|equipment|financing|livestock → feature landings     │
│   design-system/      → token + primitive showcase            │
└──────────────┬───────────────────────────────────────────────┘
               │  server components / RSC
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Client components (src/components/, src/app/**/Client.tsx)   │
│   ui/           → primitives (Button, Card, StatusPill, …)     │
│   feature-landing/ → shared landing surface                    │
│   wallet/       → WalletProvider, WalletButton                 │
└──────────────┬───────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Data layer (src/lib/)                                        │
│   api/         → fetch client + typed endpoints               │
│   wallet/      → Freighter connect + SEP-40 sign-in           │
│   theme-store  → theme persistence                            │
└──────────────┬───────────────────────────────────────────────┘
               │  HTTP (REST)  ────────────────►  verdant-backend
```

Data flow: server components fetch/route; client components call `src/lib/api`
which talks to the backend REST API (contract in `docs/api/`). Wallet actions
use `src/lib/wallet` and `src/lib/api/auth.ts`.

## Routes

| Route | Purpose | Data source |
|-------|---------|-------------|
| `/` | Home: hero + five pillar cards linking to surfaces | static |
| `/discover` | **AgriScout** discovery: search form, results grid, pagination | `GET /api/v1/farmers` (AD-010) |
| `/farmers/[address]` | **AgriScout** farmer profile: metadata + verification markers | `GET /api/v1/farmers/:address` |
| `/verify` | **AgroProof** feature landing (verification along the chain) | static demo data |
| `/equipment` | **AgriLease** feature landing (escrowed equipment bookings) | static demo data |
| `/financing` | **FarmFund** feature landing (milestone financing) | static demo data |
| `/livestock` | **LivestockPass** feature landing (livestock identity/history) | static demo data |
| `/design-system` | Design-system showcase (tokens + primitives) | static |

## Design system & styling

See [`src/styles/README.md`](src/styles/README.md) and the `/design-system`
route for the full showcase.

- **Tokens**: CSS custom properties in `src/styles/tokens/` — color, typography,
  spacing, shape, elevation, motion, layout. Imported once via `tokens/index.css`.
- **Primitives** (`src/components/ui/`): `Button`, `Card`, `Container`, `Grid`,
  `Stack`, `Heading`, `Text`, `Input`, `Spinner`, `Badge`, `StatusPill`,
  `ThemeToggle`. Each has a CSS module + Vitest tests where behavior exists.
- **StatusPill marker mapping**: verification marker kinds (Agent #2
  vocabulary) map to pill tones (yellow/green/blue/purple/teal/grey) via
  `--va-pill-tone-*` tokens.
- **No utility CSS**: all layout uses CSS Modules + tokens (coordination rule).

## API & data layer

`src/lib/api/`:

- `client.ts` — base fetch client with `Authorization: Bearer` attachment and
  `setAuthToken`/`getAuthToken`/`loadAuthToken` (`localStorage` persistence,
  key `verdant.auth.token`).
- `types.ts` — shared API types (`FarmerRecord`, `FarmerSearchResponse`,
  `AuthChallenge`, `AuthVerifyPayload`, `AuthVerifyResponse`, …).
- `farmers.ts` — farmer endpoints (search, profile, register, update).
- `auth.ts` — SEP-40 auth endpoints (`getAuthChallenge`, `verifyAuth`,
  `getAuthSession`).
- `config.ts` — API base URL configuration.
- `address.ts` — Stellar address validation helpers.

API contracts (canonical): [`docs/api/farmers.md`](../docs/api/farmers.md) at
the coordination root.

## Wallet & SEP-40 auth

`src/lib/wallet/`:

- `wallet.ts` — Freighter connect/snapshot logic, `getWalletSnapshot`,
  `WalletError`.
- `auth.ts` — **SEP-40 sign-in flow**:
  1. `connectWallet()` → Stellar `G…` address
  2. `POST /api/v1/auth/challenge { address }` → `{ domain, nonce, timestamp, address }`
  3. build SEP-40 message text (byte-identical to backend `sep40_message`)
  4. sign with Freighter `signMessage`
  5. `POST /api/v1/auth/verify` → `{ token, address, roles, expires_at }`
  6. persist bearer token
  - `signOut()` clears the token.
- `auth.test.ts` — message builder + not-connected error + full sign-in happy
  path tests.

`WalletProvider` (in `src/components/wallet/wallet-provider.tsx`) loads the
persisted token on app mount. The farmer register handler signs in before
calling `registerFarmer`.

## Project layout

```
src/
├── app/                    # routes (App Router)
│   ├── page.tsx            #   home / pillar cards
│   ├── layout.tsx          #   root layout + providers
│   ├── design-system/      #   design-system showcase
│   ├── discover/           #   AgriScout search (SearchDiscoveryClient)
│   ├── farmers/[address]/  #   farmer profile (FarmerProfileClient)
│   ├── verify/             #   AgroProof landing
│   ├── equipment/          #   AgriLease landing
│   ├── financing/          #   FarmFund landing
│   └── livestock/          #   LivestockPass landing
├── components/
│   ├── ui/                 #   design-system primitives (+ tests)
│   ├── feature-landing/    #   shared feature landing component
│   ├── wallet/             #   WalletProvider, WalletButton
│   └── theme/              #   theme script
├── styles/
│   ├── globals.css         #   base/reset + token import
│   └── tokens/             #   design tokens (CSS custom properties)
├── lib/
│   ├── api/                #   data layer (client, types, endpoints)
│   ├── wallet/             #   Freighter + SEP-40 auth
│   └── theme-store.ts      #   theme persistence
└── test/setup.ts           #   Vitest setup
e2e/                        #   Playwright specs
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For API-backed routes (`/discover`, `/farmers/[address]`), the backend must be
running (see the backend README) and `src/lib/api/config.ts` must point at it.

## Scripts

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Development server                              |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve production build                          |
| `npm run lint`         | ESLint check                                    |
| `npm run lint:fix`     | ESLint fix                                      |
| `npm run format`       | Prettier write                                  |
| `npm run format:check` | Prettier check                                  |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)               |
| `npm test`             | Vitest (unit/component) run                     |
| `npm run test:watch`   | Vitest watch mode                               |
| `npm run test:e2e`     | Playwright E2E (needs `npx playwright install`) |

## Tests

```bash
npm test
```

Current suite: **55 tests passing** across 12 files, covering UI primitives
(Button, Container, Grid, Heading, Input, Stack, StatusPill, ThemeToggle),
API client + address helpers, wallet store, and the SEP-40 sign-in flow.

## E2E

```bash
npx playwright install
npm run test:e2e
```

Playwright specs live in `e2e/`.

## Definition of Done

Follows §16 of `INSTRUCTIONS.md`: meets documented interface contracts,
includes tests, passes lint/format/typecheck, no secrets, reuses shared
primitives, committed as small conventional changes. Quality gates: typecheck
clean, lint 0 errors, tests green, build succeeds (8 prerendered routes).

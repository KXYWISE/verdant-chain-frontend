# VerdAnt Frontend — Project Proposal

**The user-facing application for the VerdAnt ecosystem — open agricultural
technology & financial infrastructure built on Stellar/Soroban.**

**Document status:** 2026-08-18 · Revision 2
**Owner:** Agent #3 (Frontend Engineer)
**Part of:** the VerdAnt three-repository system (this repo, `verdant-backend`,
`verdant-contracts`).

---

## 1. Background

VerdAnt anchors farm identity, verification, equipment leasing, financing, and
livestock provenance on the Stellar blockchain. The backend provides the APIs
and wallet authentication; the contracts provide on-chain state. But none of
that reaches a producer or a counterparty without a trustworthy, usable
interface. This repository delivers that interface: a design system, the
AgriScout discovery and farmer-profile surfaces, four feature landing pages
(AgroProof, AgriLease, FarmFund, LivestockPass), and the SEP-40 Freighter
wallet-connect flow against the VerdAnt backend.

## 2. Objectives

1. Deliver a coherent **design system** with a distinct VerdAnt identity
   (AD-007), implemented with design tokens and reusable primitives.
2. Provide **AgriScout** discovery (search grid) and farmer-profile surfaces
   backed by the backend Farmer API.
3. Provide feature **landing surfaces** for AgroProof, AgriLease, FarmFund, and
   LivestockPass.
4. Integrate **SEP-40 wallet authentication** (Freighter `signMessage`) with
   bearer-token sessions, byte-compatible with the backend's challenge message.
5. Enforce quality gates: strict TypeScript, lint, typecheck, unit/component
   tests (Vitest), and E2E (Playwright).

## 3. Scope

**In scope.** Next.js App Router application, design system and primitives,
AgriScout discovery/profile, four feature landings, wallet connect and sign-in,
API client layer, theming, tests, and E2E specs.

**Out of scope.** On-chain interaction beyond wallet sign-in (contract calls are
routed through the backend); backend/API business logic (handled by
`verdant-backend`); utility-CSS frameworks (coordination rule).

## 4. Proposed solution & architecture

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

**Data flow.** Server components fetch/route; client components call the
`src/lib/api` data layer, which talks to the backend REST API (contract of
record in the coordination `docs/api/` tree). Wallet actions use `src/lib/wallet`
and `src/lib/api/auth.ts`.

**Stack.** Next.js (App Router) · React · TypeScript (strict) · Material 3
Expressive foundation with a distinct VerdAnt identity (AD-007) · plain CSS
custom properties (design tokens) + CSS Modules, **no utility CSS** · dark mode
first-class via `prefers-color-scheme` + `data-theme` · Vitest + React Testing
Library (unit/component) · Playwright (E2E) · `@stellar/freighter-api`
(SEP-40 `signMessage`) · API client with `localStorage` bearer-token
persistence.

## 5. Deliverables

### 5.1 Delivered

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

### 5.2 Delivered — wallet & SEP-40 auth

`src/lib/wallet/` implements the SEP-40 sign-in flow:

1. `connectWallet()` → Stellar `G…` address
2. `POST /api/v1/auth/challenge { address }` → `{ domain, nonce, timestamp, address }`
3. build SEP-40 message text (byte-identical to the backend `sep40_message`)
4. sign with Freighter `signMessage`
5. `POST /api/v1/auth/verify` → `{ token, address, roles, expires_at }`
6. persist bearer token (`localStorage`, key `verdant.auth.token`)
7. `signOut()` clears the token.

`WalletProvider` loads the persisted token on app mount; the farmer register
handler signs in before calling `registerFarmer`.

### 5.3 Planned

- API-backed read endpoints for projections (escrow/verification/financing)
  once the backend exposes them.
- Farmer registration/update UI forms wired to the API.
- E2E coverage expansion beyond the current specs.

## 6. Design constraints & standards

- **No utility CSS.** All layout uses CSS Modules + tokens (coordination rule).
- **Tokens.** CSS custom properties in `src/styles/tokens/` — color, typography,
  spacing, shape, elevation, motion, layout — imported once via
  `tokens/index.css`.
- **Primitives.** `src/components/ui/`: `Button`, `Card`, `Container`, `Grid`,
  `Stack`, `Heading`, `Text`, `Input`, `Spinner`, `Badge`, `StatusPill`,
  `ThemeToggle`; each has a CSS module + Vitest tests where behavior exists.
- **StatusPill marker mapping.** Verification marker kinds (Agent #2
  vocabulary) map to pill tones (yellow/green/blue/purple/teal/grey) via
  `--va-pill-tone-*` tokens.
- **Quality gates.** Strict TypeScript, lint 0 errors, typecheck clean, tests
  green, production build succeeds (8 prerendered routes).

## 7. Timeline / roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Repository foundation, tooling | Done |
| — | Design system (AD-007), tokens, primitives, `/design-system` | Done |
| — | Home + four feature landings (AgroProof/AgriLease/FarmFund/LivestockPass) | Done |
| 3 | AgriScout discovery + farmer profile backed by Farmer API | Done |
| — | SEP-40 Freighter wallet connect + bearer sessions (byte-compatible message) | Done |
| — | Projection read surfaces | Pending |

## 8. Development & operations

### Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. For API-backed routes (`/discover`,
`/farmers/[address]`), the backend must be running and `src/lib/api/config.ts`
must point at it.

### Scripts

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

### Tests

```bash
npm test
```

Current suite: **55 tests passing** across 12 files, covering UI primitives
(Button, Container, Grid, Heading, Input, Stack, StatusPill, ThemeToggle), API
client + address helpers, wallet store, and the SEP-40 sign-in flow.

### E2E

```bash
npx playwright install
npm run test:e2e
```

Playwright specs live in `e2e/`.

## 9. Project layout

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

## 10. Ownership

Owned and maintained by **Agent #3 (Frontend Engineer)** as part of the VerdAnt
program. API and auth interfaces are coordinated through the program's
integration lead (Agent #4) and recorded in the coordination root.
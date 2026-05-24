# 📁 PROJECT.md — Dashboard Layer (React + Vite)

> This file is the **single source of truth** for the dashboard (the presentation layer).
> It must be kept up to date at all times.
> Every AI agent or new developer must read this file before touching code.

---

## 1. Overview

| Field               | Detail |
|---------------------|--------|
| **Name**            | `weather-station-dashboard` |
| **Layer**           | 🖥️ Presentation (client) |
| **Current version** | `0.1.0` |
| **Status**          | 🟡 In development |
| **Type**            | Web App (SPA) |
| **Audience**        | Anyone viewing the weather station data (and portfolio visitors) |
| **Owner**           | `Jake` — `<email>` |
| **Repository**      | `https://github.com/<user>/weather-station-dashboard` |

### Problem it solves

> The weather station collects readings and stores them in the cloud, but raw data in a
> database is not human-friendly. People need to *see* the current conditions and how they
> changed over time, at a glance.

### Solution

> A real-time dashboard that shows the latest temperature, pressure, and altitude, computes
> simple statistics (max/min/avg/range), and plots the trend over selectable time ranges.
> Live values come straight from Firebase; historical series come from the backend API.

### Key objectives (what success looks like)

- [x] Show the three live metrics (temperature, pressure, altitude)
- [x] Compute and show stats per metric (max, min, average, range delta) for the selected range
- [ ] Plot a time-series trend chart with a dual axis (temp + pressure)
- [x] Switch the time range (1h / 6h / 24h / 7d / 30d)
- [x] Update in real time as new readings arrive (Firebase)
- [ ] Deploy publicly on Vercel

---

## 2. Tech Stack

> **⚠️ For AI agents:** Use EXACTLY these technologies. Do not introduce new dependencies
> without justifying them. This is a small, focused frontend — keep it lean.

### Core

| Technology     | Version   | Purpose                          |
|----------------|-----------|----------------------------------|
| React          | `19.x`    | UI framework                     |
| TypeScript     | `5.x`     | Type safety (strict mode)        |
| Vite           | `6.x`     | Bundler / dev server             |
| Tailwind CSS   | `4.x`     | Styling (utility-first)          |
| Recharts       | `2.x`     | Charts (time-series, dual axis)  |
| Firebase (web) | `11.x`    | Real-time reads (client SDK)     |

### Tooling

| Tool        | Purpose                              |
|-------------|--------------------------------------|
| pnpm        | Package manager                      |
| Vitest      | Unit tests                           |
| React Testing Library | Component tests (where useful) |
| ESLint + Prettier | Linting & formatting           |

### Infrastructure

| Tool        | Purpose             |
|-------------|---------------------|
| Vercel      | Hosting (free tier) |

### External services

| Service             | Purpose                          | Docs                          |
|---------------------|----------------------------------|-------------------------------|
| Backend API (Railway) | Historical readings (`GET /readings`) | (this project's backend)  |
| Firebase RTDB       | Live readings + device metadata  | `https://firebase.google.com/docs/database` |

> **Note:** No state library (Zustand) or React Query for now. The app is small enough that
> React's built-in state + a couple of custom hooks are sufficient. Revisit if it grows.

---

## 3. Architecture

### Where this layer sits

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard (this layer)                    │
│                  React SPA on Vercel (browser)               │
└───────────────┬──────────────────────────┬──────────────────┘
                │ REST (history)            │ Realtime listen
        ┌───────▼─────────┐        ┌────────▼──────────┐
        │ Backend API     │        │ Firebase RTDB     │
        │ (Railway)       │        │ (client SDK)      │
        │ GET /readings   │        │ live readings +   │
        │                 │        │ devices/ metadata │
        └─────────────────┘        └───────────────────┘
```

### Data-fetching strategy ("read all from Firebase, filter client-side")

- **All readings** → subscribed directly from Firebase (client SDK) via `useReadings`, so new
  readings appear in real time without polling.
- **Range filtering** → done in the frontend (`filterReadingsByRange`), not via the backend.
  The full readings list is filtered by the selected range in the client.
- **Stats (max/min/avg/Δ)** → computed in the frontend (`computeStats`) from the filtered list.
- **Device metadata** (name, location) → read once from Firebase `devices/<id>` (`useDeviceMeta`).

> **Decision (Camino A):** for the current data volume, reading everything from Firebase and
> filtering/computing in the client is simplest and gives real-time updates for free. The
> backend `GET /readings` endpoint still exists and is available, but the dashboard does not
> use it for now. Revisit (hybrid: backend for history + Firebase for live) if data grows large.

### Patterns in use

- **Architecture:** Single-page app (SPA), client-side rendering (CSR)
- **State:** local component state + custom hooks; no global store yet
- **Stats computation:** in the frontend, from the readings array (no backend stats endpoint)
- **Styling:** Tailwind utility-first

---

## 4. Project Structure

```
weather-station-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Generic reusable bits (Card, RangeButton, ...)
│   │   └── features/        # Dashboard-specific (MetricCard, TrendChart, RangeFilter, ...)
│   ├── hooks/               # useReadings, useLiveReading, useDeviceMeta, ...
│   ├── lib/                 # api client, firebase client, helpers
│   ├── services/            # stats calculation (pure functions) — testable
│   ├── types/               # Reading, Stats, DeviceMeta, TimeRange
│   └── constants/           # ranges, colors, device id
├── public/
├── tests/
│   └── unit/                # Vitest tests (stats functions, hooks)
├── .env.example             # required env vars (no values)
├── PROJECT.md               # ← This file
└── README.md
```

---

## 5. Domain Model / Key Types

> **⚠️ For AI agents:** These types must stay in sync with the backend and the data layer.
> A `Reading` here MUST match what `GET /readings` returns.

```typescript
// A single reading (matches the backend response)
type Reading = {
  ts: number;            // Unix timestamp in ms
  temp_c: number;        // temperature °C
  pressure_hpa: number;  // pressure hPa
  altitude_m: number;    // altitude m (sensor-measured)
};

// Supported time ranges (must match the backend)
type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

// Stats computed in the frontend for one metric over the selected range
type MetricStats = {
  max: number;
  min: number;
  avg: number;
  rangeDelta: number;    // max - min
};

// Device metadata (read from Firebase devices/<id>)
type DeviceMeta = {
  name: string;          // e.g. "ESP32-01"
  location: string;      // e.g. "San José, CR"
  elevation_m?: number;  // geographic elevation of the site (NOT the sensor reading)
};
```

> **⚠️ Altitude vs elevation:** `Reading.altitude_m` is the value the barometer computes and
> it fluctuates. `DeviceMeta.elevation_m` is the fixed geographic elevation of the location.
> They are different concepts — do not conflate them in the UI.

---

## 6. Features and Scope

### ✅ In Scope (MVP)

| Feature                          | Status         | Notes                                   |
|----------------------------------|----------------|-----------------------------------------|
| Read readings from Firebase      | ✅ Done        | `useReadings` (real-time subscription)  |
| Range filtering (client-side)    | ✅ Done        | `filterReadingsByRange` (pure, tested)  |
| Stats per metric (max/min/avg/Δ) | ✅ Done        | `computeStats` (pure, tested)           |
| Three metric cards (temp/press/alt) | ✅ Done     | `MetricCard` with current value + stats |
| Time-range filter (1h…30d)       | ✅ Done        | `RangeFilter` (five buttons)            |
| Real-time updates (Firebase)     | ✅ Done        | via `useReadings` `onValue` subscription|
| Trend chart (dual axis)          | ⬜ Pending     | Recharts (next piece)                   |
| Device header (name + location)  | 🚧 Hook ready  | `useDeviceMeta` built, not wired to UI  |
| "Real time" indicator            | ⬜ Pending     | visual badge                            |
| Visual polish (glassmorphism)    | ⬜ Pending     | match the design mockup                 |
| Deploy to Vercel                 | ⬜ Pending     |                                         |

### ❌ Out of Scope (for now)

- Authentication / user accounts
- Multiple devices / device switcher (single device for now)
- Endpoint to register devices (metadata is injected manually into Firebase for now)
- CSV export, alerts/notifications, dark/light theme toggle

---

## 7. API & Contracts

### What the dashboard consumes

```
Backend (Railway):
  GET /readings?range=1h|6h|24h|7d|30d
    → 200 { "data": Reading[] }
    → 400 { "error": { "code": "INVALID_RANGE", ... } }

Firebase (client SDK):
  readings/<deviceId>          → live readings (subscribe for real time)
  devices/<deviceId>           → { name, location, elevation_m? }
```

### Conventions

- Backend responses: `{ data }` on success, `{ error: { code, message } }` on failure.
- Timestamps are Unix ms (`number`), consistent across all layers.
- The dashboard reads only; it never writes.

---

## 8. Code Conventions

> **⚠️ For AI agents:** Follow these conventions. Do not deviate.

### Naming

| Type              | Convention         | Example                     |
|-------------------|--------------------|-----------------------------|
| React components  | PascalCase         | `MetricCard.tsx`            |
| Hooks             | camelCase + `use`  | `useReadings.ts`            |
| Types/Interfaces  | PascalCase         | `type TimeRange = ...`      |
| Constants         | UPPER_SNAKE_CASE   | `DEFAULT_RANGE`             |
| Functions/vars    | camelCase          | `computeStats()`            |
| Util files        | kebab-case         | `format-date.ts`            |

### General rules

- **Strict TypeScript:** `strict: true`. No `any` without justification, no `@ts-ignore`.
- **Path alias:** use `@/` for `src/` (same as the backend).
- **Semicolons:** yes (consistent with the backend style).
- **Components:** functional only, no class components.
- **Keep logic out of components:** stats and data shaping live in `services/` (pure, testable).
- **Styling:** Tailwind utility-first. No CSS-in-JS, no CSS modules unless justified.
- **Comments:** English, only when the "why" isn't obvious.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).

### Component structure

```tsx
// 1. External imports
import { useState } from 'react';
// 2. Internal imports
import { computeStats } from '@/services/stats';
// 3. Local types
type Props = { readings: Reading[] };
// 4. Component
export function MetricCard({ readings }: Props) {
  // hooks first, then handlers, then render
}
```

---

## 9. Environment Variables

```bash
# .env.example — copy to .env and fill in. Vite exposes only VITE_* vars to the client.

# Backend API base URL (Railway)
VITE_API_BASE_URL=https://<your-app>.up.railway.app

# Firebase web config (client SDK — safe to expose, but still kept in env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=https://weather-station-db-52500-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=

# Which device this dashboard shows
VITE_DEVICE_ID=esp32-01
```

> **Note:** Firebase web config values are not secret (they identify the project, and security
> is enforced by database rules), but we keep them in `.env` for cleanliness and to switch
> between projects easily.

---

## 10. Local Setup

```bash
# 1. Clone and enter
git clone https://github.com/<user>/weather-station-dashboard.git
cd weather-station-dashboard

# 2. Install deps
pnpm install

# 3. Configure env
cp .env.example .env
# → fill in the values

# 4. Start dev server
pnpm dev
```

### Scripts

| Script           | Description                       |
|------------------|-----------------------------------|
| `pnpm dev`       | Dev server (hot reload)           |
| `pnpm build`     | Production build                  |
| `pnpm preview`   | Preview the production build      |
| `pnpm test`      | Unit tests (Vitest)               |
| `pnpm test:run`  | Unit tests once (CI mode)         |
| `pnpm typecheck` | TypeScript check                  |
| `pnpm lint`      | ESLint                            |

---

## 11. Testing

- **Unit tests:** Vitest (+ React Testing Library where a component has real logic).
- **Primary targets:** the **stats functions** in `services/` (pure, easy to test) — exactly
  the kind of logic worth protecting (max/min/avg/range over a readings array).
- **Vitest needs the `@` alias** configured in `vitest.config.ts` (same gotcha as the backend).
- **What to test:** stats math, data-shaping helpers, custom hooks with logic.
- **What NOT to test:** trivial presentational markup, Recharts internals, third-party libs.

---

## 12. Git & Branching

```
main          → production (deploys to Vercel)
feature/xxx   → new features
fix/xxx       → bugfixes
```

**PR / commit rules:**
- Small, focused commits with Conventional Commits messages.
- `.env` is never committed (`.gitignore`).
- Typecheck + tests should pass before merging to `main`.

---

## 13. Architecture Decision Records (ADR)

| Date        | Decision                                  | Rationale                                                        |
|-------------|-------------------------------------------|------------------------------------------------------------------|
| 2026-05-22  | React + Vite + TS (not Next.js)           | Small SPA; no SSR/SEO needs; Vite is lighter and faster to set up |
| 2026-05-22  | Recharts for charts                       | Declarative, React-native API; clean dual-axis time series       |
| 2026-05-22  | Compute stats in the frontend             | Data already in the client; trivial math; avoids a backend endpoint |
| 2026-05-22  | Real-time via Firebase client SDK         | True push updates instead of polling the backend                 |
| 2026-05-22  | No Zustand / React Query yet              | App is small; local state + hooks suffice. Revisit if it grows   |
| 2026-05-22  | Device metadata in Firebase `devices/`    | Read by the dashboard; injected manually for now (endpoint later)|
| 2026-05-23  | Read all from Firebase, filter client-side| Simplest for current volume; real-time for free. Backend `/readings` unused for now |

---

## 14. Current Project Status

**Last updated:** `2026-05-23`

### What already exists and works

- [x] Vite + React + TS project scaffolded; Tailwind 4 wired (`@tailwindcss/vite` + `@import`)
- [x] `@/` path alias configured in Vite, tsconfig, and Vitest
- [x] Firebase client connected (`lib/firebase.ts`), reading live data
- [x] `useReadings` — real-time subscription to `readings/<deviceId>`
- [x] `useDeviceMeta` — reads `devices/<deviceId>` (hook ready, not yet shown in UI)
- [x] `filterReadingsByRange` — client-side range filtering (pure, unit-tested)
- [x] `computeStats` — max/min/avg/rangeDelta per metric (pure, unit-tested)
- [x] `RangeFilter` — five range buttons, controlled component
- [x] `MetricCard` — shows current value + stats; three cards (temp/pressure/altitude)
- [x] Unit tests passing (Vitest) for stats; tests included in `tsconfig.app.json`
- [x] Types unified in `types/reading.ts` (Reading, TimeRange, DeviceMeta)
- [x] Firebase production rules active + `devices` node created (see data-layer)

### In progress right now

- [ ] Trend chart with Recharts (dual axis: temp + pressure)

### Pending

- [ ] Wire `useDeviceMeta` into a header (device name + location)
- [ ] "Real time" indicator badge
- [ ] Visual polish to match the design (glassmorphism, gradients, layout)
- [ ] Deploy to Vercel

### Known technical debt

- [ ] Device metadata is injected manually; no registration endpoint yet
- [ ] Backend assigns/handles timestamps as placeholder (`millis()` from device) — ESP32
      readings won't fall in real-time range filters correctly until resolved at the firmware level
- [ ] `api.ts` (backend client) exists but is unused (Camino A); keep or remove later

### Known limitations

- [ ] Single device only (no multi-device support yet)
- [ ] Physical BMP280 sensor pending replacement (factory-defective) — data is simulated

---

## 15. Context for AI Agents

> This section gives context to any LLM working on this dashboard.

### Critical instructions

1. **Read this whole document before writing code.**
2. **`Reading` must match the backend response and the data layer.** Don't rename fields.
3. **Don't conflate `altitude_m` (sensor) with `elevation_m` (location metadata).**
4. **Keep stats logic in `services/` as pure functions** so it stays unit-testable.
5. **The dashboard only reads.** Never write to Firebase or the backend from here.
6. **No new dependencies** without justification — keep the app lean (no global store yet).
7. **Use the `@/` path alias and semicolons**, consistent with the backend.
8. **Build incrementally:** data first, then cards, then chart, then real time, then visual polish.

### Preferred patterns

```tsx
// ✅ Small, focused components
// ✅ Custom hooks for data fetching (useReadings, useLiveReading)
// ✅ Pure functions for stats (computeStats) — tested
// ✅ Explicit prop types
// ❌ Avoid components over ~200 lines without reason
// ❌ Avoid useEffect for logic that belongs in a handler
// ❌ Avoid inline styles (use Tailwind)
```

### How to ask for help

Provide: the specific component/hook to work on, the expected behavior, what you already
tried, and any constraint not documented here.

---

*This document must evolve with the project. If anything in the code contradicts this document, update the document.*

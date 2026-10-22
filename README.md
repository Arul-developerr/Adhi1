# 🩸 LifeBlood — Smart Blood Bank Management System

**TN LifeBlood** is a modern, responsive web application for managing blood bank
operations across **Namakkal District, Tamil Nadu**. It connects government and
private blood banks with donors, giving hospitals a view of stock, an
automated donor-matching engine, emergency broadcasts, and district-level
demand forecasting.

> **Status:** Demo / portfolio project. All data is currently seeded from a
> local TypeScript data layer — there is no database and no backend API. See
> [Data & Demo Limitations](#-data--demo-limitations).

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Application Routes](#-application-routes)
- [Local Usage](#-local-usage)
- [Linting, Type-Checking & Testing](#-linting-type-checking--testing)
- [Data & Demo Limitations](#-data--demo-limitations)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏠 Landing Page (`/`)
- Marketing shell with its own navbar/footer, separate from the operational workspace
- Hero with a custom **district network schematic** derived from the seeded forecast zones
- Animated stat row (units available, registered donors, blood banks, active alerts)
- Feature showcase cards and a "how the network works" walkthrough
- Responsive navigation with a mobile drawer

### 🩸 Donor Registration (`/register`)
- **3-step wizard** — personal details → contact & location → eligibility review
- **Client-side eligibility engine**: rejects donors under **18 years** or under **50 kg**
- Polished step indicator, inline validation, required-field markers, and a final review step
- A visible **demo disclosure** stating the record is held in browser memory only

### 🆘 Emergency Blood Request (`/request`)
- Request form capturing hospital, blood group, **units required**, urgency level, and patient details
- **Simulated matching** with a scanning progress state, explicitly labelled as simulated
- Returns a ranked donor match card with distance, ETA, and donor rating
- Urgency is conveyed through typographic and tonal hierarchy, not decorative alarm animation
- A **demo notice** states that no donor is contacted and no request is dispatched

### 🤖 Donor Matching (`/matching`)
- Select a required blood group and see the **compatible donor groups** computed live
- "Run compatibility search" scans the donor network with a progress state
- Lists compatible, currently-available donors with distance/ETA/rating
- An on-page **compatibility reference** table alongside the ranked results
- Matches and unavailable donors are visually distinct, and the medically defined
  red-blood-cell rules are used unchanged

### 📦 Inventory (`/inventory`)
- Unit counts for all **8 blood groups** across every blood bank
- Filter by **district**, **bank type** (government/private), and **blood group**
- Applied filters are shown as clearable chips
- Bar chart of stock per blood group, colour-coded by par-level scarcity
- Bank directory with designed empty / filtered / error states

### 🔔 Emergency Alerts (`/alerts`)
- Chronological alert feed with a simulated event stream, marked as simulated
- **Broadcast a new alert** — pick a hospital, blood group, urgency, and message
- Differentiated totals for critical, high, and resolved alerts
- One-click **resolve** action with a confirmation step, and consistent toasts

### 🧠 Predictions (`/predictions`)
- District-level **current vs. predicted demand** with percentage change
- **Risk-level** classification (low / medium / high / critical) per zone
- Click any zone to open a detailed analysis panel
- Monthly demand-vs-supply trend chart, seasonal driver chart, and zone comparison chart
- Forecasts are labelled as pre-computed and simulated — no model accuracy is claimed

### 📊 Dashboard (`/dashboard`)
- District command centre: KPI row, demand-vs-supply trend, and critical-zone highlighting
- Network schematic with per-zone risk, bank count, and scarcest blood group
- Recent request list with urgency and fulfilment status
- Quick links into the emergency request flow

### 🌐 Cross-Cutting
- **Dark / light theme** as two coordinated palettes (persisted via `next-themes`)
- Collapsible **left sidebar** for operational routes, grouped by Overview / Blood
  Operations / Intelligence / Community
- Dedicated **mobile navigation** (keyboard-managed drawer + bottom bar) rather than a shrunken sidebar
- Purposeful Framer Motion transitions that respect `prefers-reduced-motion`
- Accessible form labels, focus rings, and semantic markup throughout

---
## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 14.2.4** (App Router) |
| UI Library | **React 18** |
| Language | **TypeScript 5** (strict mode) |
| Styling | **Tailwind CSS 3.4** + semantic CSS color variables |
| Animation | **Framer Motion 11** |
| Charts | **Recharts 2.12** |
| Icons | **Lucide React** |
| Theming | **next-themes 0.3** (dark mode) |
| Class Utilities | **clsx** + **tailwind-merge** |
| Linting | **ESLint 8** + `eslint-config-next` (`next/core-web-vitals`) |
| Build | **PostCSS** pipeline via Next.js |

---

## 📋 Prerequisites

Before you begin, make sure you have installed:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | `>= 18.17.0` | LTS recommended (20.x or 22.x) |
| **npm** | `>= 9` | Ships with Node.js 18+ |
| **Git** | any | Optional, for cloning the repo |

Check your versions:

```bash
node --version
npm --version
```

> **No database, Docker, or external service is required.** The app runs entirely
> from a local seeded data module.

---

## 🚀 Installation

**1. Clone the repository**

```bash
git clone <your-repository-url>
cd Blood
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open the app**

Navigate to [http://localhost:3000](http://localhost:3000).

The dev server supports hot module replacement — edits to any file under
`src/` are reflected instantly.

---

## 🔐 Environment Variables

**This project currently requires no environment variables.** There is no
`.env` file, no API keys, and no database connection string.

The app is fully self-contained: all records live in
[`src/lib/tn-data.ts`](src/lib/tn-data.ts), which is imported directly by the
pages.

If you later connect a backend, the conventional place to put secrets is a
local `.env.local` file (git-ignored by default):

```bash
# .env.local  — example only
DATABASE_URL="postgresql://user:password@localhost:5432/lifeblood"
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

> Never commit `.env.local`. Prefixing a variable with `NEXT_PUBLIC_` makes it
> visible to the browser — only use that prefix for values that are safe to
> expose publicly.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start the development server on `http://localhost:3000` with hot reload. |
| `npm run build` | `next build` | Create an optimized production build in `.next/`. |
| `npm start` | `next start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | `next lint` | Run ESLint against the project using the Next.js core-web-vitals ruleset. |

Additional useful commands (not in `package.json`):

```bash
# Type-check without emitting files
npx tsc --noEmit

# Lint a single directory
npx eslint src --ext .ts,.tsx
```

---

## 📁 Project Structure

```
.
├── .eslintrc.json            # ESLint config (next/core-web-vitals)
├── next.config.mjs           # Next.js configuration
├── next-env.d.ts             # Auto-generated Next.js type definitions
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS plugins for Tailwind
├── tailwind.config.ts        # Tailwind theme, blood palette, animations
├── tsconfig.json             # TypeScript config (strict, "@/*" path alias)
├── tools/                    # Headless-Chrome verification harnesses (dev only)
│   ├── check.js              # Overflow / layout / chart-geometry assertions
│   ├── flows.js              # Interaction smoke test driven by real mouse events
│   └── shot.js               # Screenshot capture (light + dark)
└── src/
    ├── app/                  # App Router — routes, grouped by shell
    │   ├── layout.tsx        # Root layout: fonts, theme provider, page transition
    │   ├── globals.css       # Global styles & design tokens
    │   ├── (marketing)/      # Public shell
    │   │   ├── layout.tsx    # Marketing navbar + footer
    │   │   └── page.tsx      # Landing page  →  /
    │   └── (workspace)/      # Operational shell
    │       ├── layout.tsx    # Sidebar + top bar + mobile nav
    │       ├── alerts/       # Emergency alerts & broadcasts
    │       ├── dashboard/    # District command centre
    │       ├── inventory/    # Blood stock per bank
    │       ├── matching/     # Donor matching engine
    │       ├── predictions/  # Demand forecasting & risk zones
    │       ├── register/     # Donor registration wizard
    │       └── request/      # Emergency blood request
    ├── components/
    │   ├── app-shell.tsx             # Workspace layout: sidebar + top bar + content
    │   ├── app-sidebar.tsx           # Grouped, collapsible desktop navigation
    │   ├── app-topbar.tsx            # Page context, district scope, theme control
    │   ├── mobile-nav.tsx            # Mobile drawer + bottom navigation
    │   ├── district-network.tsx      # SVG network schematic (derived from seed data)
    │   ├── marketing-navbar.tsx      # Public navigation
    │   ├── marketing-footer.tsx      # Public footer
    │   ├── page-transition.tsx       # Route transition wrapper
    │   ├── theme-provider.tsx        # next-themes wrapper
    │   ├── theme-toggle.tsx          # Light / dark control
    │   └── ui/                       # Reusable primitives
    │       ├── badge.tsx             # Blood-group + status badges
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── chart.tsx             # Chart container, legend, tooltip, axis tokens
    │       ├── demand-supply-chart.tsx
    │       ├── demo-badge.tsx        # "Simulated" / demo-data indicator
    │       ├── empty-state.tsx
    │       ├── input.tsx
    │       ├── kpi-card.tsx
    │       ├── label.tsx
    │       ├── page-header.tsx
    │       ├── select.tsx
    │       ├── slot.tsx              # Shared class-name slot helper
    │       └── toast.tsx
    └── lib/
        ├── tn-data.ts        # All seeded data + query helpers (single source of truth)
        ├── blood-groups.ts   # Canonical group order, labels, colour mapping
        ├── operations.ts     # Scarcity tiers, network stats, risk & urgency labels
        ├── navigation.ts     # Nav groups and district scope
        ├── format.ts         # Number / percent / date formatting
        └── utils.ts          # `cn()` class-merging helper
```

Route groups `(marketing)` and `(workspace)` change the component tree, not the
URLs — every route listed below keeps its original path.

---

## 🧭 Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | Marketing hero, district network schematic, feature walkthrough |
| `/register` | Register Donor | 3-step donor sign-up with eligibility checks |
| `/request` | Request Blood | Emergency request form + simulated donor search |
| `/dashboard` | Dashboard | District-level command centre with KPIs and trend charts |
| `/matching` | Donor Matching | Blood-group compatibility matching engine |
| `/inventory` | Inventory | Per-bank stock levels, scarcity tiers, and filtering |
| `/alerts` | Emergency Alerts | Alert feed, broadcasts, and resolution |
| `/predictions` | Predictions | Demand forecast and shortage risk zones |

---

## 🖥 Local Usage

1. **Start the dev server**

   ```bash
   npm run dev
   ```

2. **Browse the app** at [http://localhost:3000](http://localhost:3000).

3. **Try a full workflow:**

   - **Register a donor** → go to `/register`, walk through all 3 steps.
     Try entering an age of `17` or a weight of `45` to see the eligibility
     rule reject the submission.
   - **Request blood** → go to `/request`, pick a blood group and urgency, then
     click **Search compatible donors** to see the scanning state and the
     matched donor card.
   - **Match donors** → go to `/matching`, choose a group (e.g. `O-`), and click
     **Run compatibility search** to see every compatible, available donor.
   - **Check stock** → go to `/inventory`, filter by bank type or district, and
     watch the aggregate chart and bank directory update.
   - **Broadcast an alert** → go to `/alerts`, click **Broadcast alert**, select a
     hospital, and submit. The new alert appears at the top of the feed.
   - **Review forecasts** → go to `/predictions` and click any zone row for
     the detailed risk analysis.

4. **Toggle the theme** using the sun/moon button in the top bar (desktop) or
   the mobile navigation. The preference persists across reloads via
   `localStorage`.

---

## ✅ Linting, Type-Checking & Testing

Run the full quality gate locally:

```bash
# 1. TypeScript (no emit)
npx tsc --noEmit

# 2. ESLint
npm run lint

# 3. Production build (also type-checks)
npm run build
```

All three commands should complete with **exit code 0** and no errors.

### Browser-based verification (`tools/`)

The `tools/` directory holds three dependency-free harnesses that drive a
headless Chrome over the DevTools Protocol (Node built-ins only — no extra npm
dependencies). They require a running server:

```bash
npm run build
npx next start -p 3777          # in one terminal

node tools/check.js  http://localhost:3777   # layout / overflow / chart geometry
node tools/flows.js  http://localhost:3777   # interaction smoke test

# node tools/shot.js <url> <out.png> [width] [height] [theme] [fullPage] [scrollY]
node tools/shot.js http://localhost:3777/dashboard dash.png 1440 900 light
node tools/shot.js http://localhost:3777/ inventory.png 390 844 dark
```

- **`check.js`** — loads every route at 360 / 390 / 768 / 1024 / 1440 px and
  asserts there is no horizontal page overflow, that no element extends past
  the viewport, that every Recharts plot uses at least 75 % of its SVG width,
  and that all 8 blood groups are present in the rendered text.
- **`flows.js`** — exercises the real interactions (inventory filters, matching
  search, request validation, alert broadcast and resolve, registration step
  validation, prediction zone detail, theme toggle and persistence) using
  dispatched mouse events so React's handlers actually run.
- **`shot.js`** — captures a full-page screenshot at a given width and theme.

On Windows, set `CHROME_PATH` if Chrome is not installed at the default
location.

### Unit tests

**There is no automated unit-test suite in this repository yet.** There is no
`jest.config.*`, `vitest.config.*`, or `playwright.config.*`, and no
`test`/`e2e` script in `package.json`.

To add tests, install a runner and wire up a script, for example:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

then add a `"test": "vitest run"` entry to `package.json`. The pure helper
functions in `src/lib/tn-data.ts` (`getCompatibleDonors`, `getTotalInventory`,
`getHospitalsByDistrict`, `getHospitalsByType`, `getDonorsByBloodGroup`) and in
`src/lib/operations.ts` (`getScarcityTier`, `getBankStockTier`,
`getGroupScarcity`, `getNetworkStats`) are the most natural first targets,
since they contain no React dependency.

---

## 📊 Data & Demo Limitations

> ⚠️ **Please read this before treating the app as production-ready.**

All data lives in a single file, [`src/lib/tn-data.ts`](src/lib/tn-data.ts).
There is **no database and no backend API**.

### What is real

- The **TypeScript types** (`Hospital`, `Donor`, `EmergencyAlert`,
  `PredictionZone`, `BloodInventory`) are real and consistently used.
- The **blood-group compatibility table** is medically correct for
  red-blood-cell donation (O⁻ → everyone, AB⁺ → AB⁺ only, etc.).
- The **eligibility rules** (age ≥ 18, weight ≥ 50 kg) match standard blood
  donation guidance.
- The **aggregation logic** — totals, filtering, and compatibility lookup — is
  genuine working code, not hardcoded output.

### What is simulated

| Area | Reality |
|---|---|
| Donor registration | Submitted in-browser only; **nothing is persisted**. A reload loses the record. |
| Blood requests | Matched against the seeded donor pool; **no request is stored or routed**. |
| Emergency broadcasts | Appear in local state with a toast; **no SMS, email, or push is sent**. |
| "Live" inventory & alerts | The numbers are static seed data; a timer simulates incoming events to make the feed feel active. |
| Donor matching / predictions | Rule-based lookups and pre-computed forecasts, **not a trained ML model**. No model accuracy is claimed anywhere in the UI. |
| Hospital data | Real Namakkal District banks with plausible contact details, but inventory figures are **illustrative, not real stock levels**. |
| Donor phone numbers | Partially masked placeholders. |
| District network schematic | Node positions are **illustrative**, not a geographic projection; the values shown are derived from the seed data. |

Every one of these surfaces carries a visible in-app indicator (the `DemoBadge`
component — *"Portfolio demonstration"*, *"Seeded district snapshot"*,
*"Session-only form"*, *"Demonstration workflow"*, *"Simulated matching"*,
*"Seeded stock records"*, *"Local alert feed"*, *"Simulated forecasts"*) so the
distinction between an implemented interaction and a simulated one is never
left to inference.

### Intended path to production

1. Replace `src/lib/tn-data.ts` with a database layer (PostgreSQL + Prisma, for example).
2. Move pages that need secrets into **Server Components** and expose mutations through Route Handlers or Server Actions.
3. Add real authentication (donor and hospital accounts) and role-based access control.
4. Integrate an SMS provider (Twilio/MSG91) for genuine emergency broadcasts.
5. Wire the prediction module to a real forecasting service or model.
6. Validate every clinical rule against current medical guidance before use.

---

## 🩺 Troubleshooting

### `next lint` hangs or prompts for setup

The repo ships an `.eslintrc.json`. If ESLint asks to configure itself, the
file is missing or unreadable — restore it:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@next/next/no-img-element": "off"
  }
}
```

### `Error: hooks can only be called inside the body of a function component`

A page using `useState`/`useEffect` is missing the `"use client"` directive at
the very top of the file. Add it as the first line:

```tsx
"use client"
```

### `Type error: ... has no exported member` or `Cannot find module '@/...'`

The `@/*` path alias is configured in `tsconfig.json` and points at `./src/*`.
Make sure new files live under `src/` and that you import them as
`@/components/...`, `@/lib/...`.

If imports resolve in the editor but fail at build time, delete
`tsconfig.tsbuildinfo` and `.next/`, then reinstall:

```bash
rm -rf .next tsconfig.tsbuildinfo
npm install
```

### Build fails on an out-of-memory error

Next.js builds are memory-hungry. Retry with a larger heap:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### `Module not found: Can't resolve 'tailwindcss'` or missing PostCSS plugins

A partial or corrupted install. Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Fonts fail to load (network-restricted environment)

`next/font/google` (the Inter font in `src/app/layout.tsx`) downloads fonts at
build time. Without internet access the build may fail. Either allow network
access during the build, or swap Inter for a system font stack locally.

### Styles look unstyled / classes are missing

Tailwind scans specific paths in `tailwind.config.ts`. If you add a new
top-level folder under `src/`, add its glob to the `content` array and restart
the dev server.

### The page loads but everything is empty

Most pages render from `src/lib/tn-data.ts`. Confirm you have not emptied or
corrupted that file, and that `src/lib/utils.ts` still exports `cn`.

### Port 3000 is already in use

```bash
npm run dev -- --port 3001
```

### Stale build cache

```bash
rm -rf .next
npm run build
```

---

## 🚢 Deployment

The app is a standard Next.js application and deploys to any platform that
supports a Node.js runtime.

### Build locally first (recommended)

```bash
npm run build
npm start   # verifies the production bundle
```

### Vercel (recommended, zero config)

1. Push the code to a GitHub/GitLab/Bitbucket repository.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel detects Next.js automatically — keep the defaults:
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Click **Deploy**.

No environment variables are required for the current version.

### Docker (self-hosted)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

Then:

```bash
docker build -t lifeblood .
docker run -p 3000:3000 lifeblood
```

### Static export (optional)

The app is fully client-rendered, so it can be exported as static files. Add to
`next.config.mjs`:

```js
const nextConfig = { output: "export" };
```

Then run `npm run build` and serve the generated `out/` directory. Note that
`next/image` optimisation requires a custom loader in static-export mode.

### Other platforms

**Vercel, Netlify, and Render** all work with the standard Next.js build. On
long-running Node hosts, remember that `npm start` must be able to bind a
`PORT` environment variable.

---

## 🤝 Contributing

Contributions are welcome.

**Getting started**

```bash
git clone <your-repository-url>
cd Blood
npm install
npm run dev
```

**Before opening a pull request, make sure all three checks pass:**

```bash
npx tsc --noEmit     # types
npm run lint         # lint
npm run build        # production build
```

**Guidelines**

- Match the existing code style: 4-space indentation, double quotes, semicolons
  omitted, and `cn()` from `@/lib/utils` for conditional class names.
- Keep new UI primitives in `src/components/ui/` and reuse them rather than
  duplicating markup.
- Add or update data in `src/lib/tn-data.ts` and update the derived TypeScript
  types alongside it.
- Do not hardcode values that can be derived from the data layer — compute them
  (see `getTotalInventory()` and `getCompatibleDonors()` in `tn-data.ts`, and
  `getScarcityTier()` / `getNetworkStats()` in `operations.ts`, for the pattern).
- Do not introduce a second source of truth for operational numbers. If a new
  figure appears on a page, it should be computed in `src/lib/operations.ts`
  from the seeded data.
- Keep `"use client"` at the top of any file that uses React hooks or browser
  APIs.
- Write accessible markup: associate every input with a `<Label>` and keep
  focus states visible.
- When adding a responsive grid, give it a base `grid-cols-1`. A grid with no
  base column count gets an `auto`-sized implicit column that expands to
  max-content and can reintroduce horizontal overflow on narrow viewports.
- Never claim a capability the demo does not have. If a surface is simulated,
  mark it with `<DemoBadge>` and describe it honestly in the pull request.
- Describe user-facing changes in the pull request body, with screenshots for
  UI work.

**Reporting bugs**

Open an issue with the route affected, the browser and OS, reproduction steps,
and the expected versus actual behaviour. Screenshots help a lot.

---

## 📄 License

This project is provided for **educational, academic, and demonstration
purposes**.

Unless a different license is specified in the repository, the code is released
under the **MIT License**:

```
MIT License

Copyright (c) 2025 LifeBlood Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Disclaimer

This is a **demonstration project**. It is not a medical device, is not
approved for clinical use, and must not be used to make real transfusion
decisions. All donor, inventory, and demand figures are illustrative. Always
follow current medical guidance and official blood-bank protocols.

---

<div align="center">

**Made with ❤️ for Namakkal District blood banks**

`Next.js` · `TypeScript` · `Tailwind CSS` · `Framer Motion` · `Recharts`

</div>

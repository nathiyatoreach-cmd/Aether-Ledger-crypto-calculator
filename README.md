# Aether Ledger

Aether Ledger is a premium, production-style **AI Crypto Calculator** built with Next.js, TypeScript, Tailwind CSS v4, Recharts, and Framer Motion.

It ships with:

- live crypto pricing with mock fallback
- main crypto/fiat calculator
- profit and loss, break-even, DCA, staking, allocation, leverage, tax, and risk tools
- flexible AI provider routing
- local history, export, snapshots, and journal features
- polished demo mode for screenshots and product listings

## File Tree

```text
crypto-calc-001/
|- app/
|  |- globals.css
|  |- icon.svg
|  |- layout.tsx
|  `- page.tsx
|- components/
|  |- charts.tsx
|  |- crypto-calculator-app.tsx
|  `- ui.tsx
|- lib/
|  |- ai-fallbacks.ts
|  |- ai-providers.ts
|  |- calculations.ts
|  |- constants.ts
|  |- market-data.ts
|  |- storage.ts
|  |- types.ts
|  `- utils.ts
|- .env.example
|- .gitignore
|- next-env.d.ts
|- next.config.mjs
|- package.json
|- postcss.config.mjs
|- README.md
`- tsconfig.json
```

## Setup

1. Install Node.js 20+.
2. Open a terminal in `crypto-calc-001`.
3. Install dependencies:

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Environment

Copy `.env.example` if you want to override the public market API base:

```bash
cp .env.example .env.local
```

The app works without any secret environment variables because AI keys are entered through the Settings UI and stored in browser `localStorage`.

## AI Provider Switching

Go to the **Settings** section and configure:

- provider adapter
- provider name
- model
- API key
- base URL
- temperature

### Supported adapter styles

- `openai`: standard OpenAI-compatible chat completions
- `groq`: OpenAI-compatible base URL preset
- `together`: OpenAI-compatible base URL preset
- `custom-openai`: any OpenAI-compatible endpoint you want to plug in
- `anthropic`: Anthropic Messages wrapper
- `gemini`: Gemini `generateContent` wrapper

## OpenAI-Compatible Endpoints

To plug in any OpenAI-compatible endpoint:

1. Choose `Custom OpenAI-compatible`.
2. Paste the provider name you want displayed.
3. Paste the model name expected by that endpoint.
4. Paste the base URL ending in `/v1` when appropriate.
5. Paste the API key.

Examples include self-hosted gateways, OpenRouter-style services, Together-compatible routes, Groq-compatible routes, or private internal proxies.

## Security Note

This app intentionally stores AI keys only in browser `localStorage` for local/demo convenience.

For production:

- move AI requests to a backend proxy or API route
- store secrets server-side
- enforce rate limits and provider-side validation
- sanitize provider errors before returning them to the client

## Live Market Data

The market layer uses CoinGecko simple price data by default. If the request fails, the app gracefully falls back to demo data and keeps the interface usable.

## Marketplace Listing Copy

### Product Name

Aether Ledger

### Short Description

A premium AI crypto calculator with live pricing, risk modeling, DCA analysis, portfolio planning, and flexible multi-provider AI assistance.

### Long Description

Aether Ledger is a polished, marketplace-ready crypto calculator app designed for traders, DeFi users, and advanced beginners who want more than a basic conversion widget. It combines live market pricing, a powerful trade calculator, advanced planning tools, portfolio analytics, and AI-generated plain-English guidance inside a high-end dashboard interface. Users can evaluate entries and exits, model break-even points, compare scenarios, estimate staking yield, review risk-to-reward setups, and connect their preferred AI provider through a flexible settings panel.

### Key Features

- crypto-to-fiat calculator with P/L, fees, slippage, leverage, and break-even outputs
- advanced tools for DCA, staking, allocation, tax estimation, and liquidation planning
- AI assistant with natural-language parsing and scenario explanation
- support for OpenAI-compatible, Groq-compatible, Together-compatible, Anthropic, Gemini, and custom endpoints
- live market pricing with graceful demo fallback
- demo mode, history, CSV/JSON export, portfolio snapshots, and trade journal
- mobile-friendly premium dashboard layout with charts and motion

### Selling Points

- looks like a finished SaaS product, not a template demo
- ready for screenshots, previews, and marketplace listings
- local AI key workflow for instant testing
- modular code structure for easy backend hardening later
- strong product identity with premium visual treatment

### Target Audience

- crypto traders
- swing traders
- DeFi users
- crypto educators
- finance dashboard buyers
- no-code founders and indie makers selling niche tools

### Suggested Price Range

`$39-$89` for a standard marketplace listing, or `$99+` as a premium niche dashboard product with support/documentation.

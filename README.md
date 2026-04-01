# RestStop Admin Dashboard

React + TypeScript admin dashboard for the RestStop platform. Provides location management, review moderation, user management, partner station management, and flagged content review.

## Tech Stack

- **Framework** — React 18 + TypeScript
- **Build tool** — Vite
- **Routing** — React Router v6
- **Data fetching** — TanStack Query v5
- **HTTP client** — Axios
- **Styling** — CSS custom properties (no framework dependency)
- **Auth** — JWT stored in memory + refresh token in httpOnly cookie pattern

## Prerequisites

- Node.js 20+
- npm 10+
- A running instance of `reststop-api`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:

```
VITE_API_URL=http://localhost:5001
```

### 3. Start the dev server

```bash
npm run dev
```

Dashboard is available at `http://localhost:5173`.

## Project Structure

```
src/
├── api/              — all API calls in one place, nothing else knows about HTTP
├── components/
│   ├── layout/       — Shell, Sidebar, Topbar
│   ├── ui/           — reusable primitives: Button, Badge, Card, DataTable, Modal
│   └── shared/       — ConfirmDialog, SearchInput
├── pages/            — one file per dashboard section
├── hooks/            — useAuth, useTheme, data hooks
├── context/          — AuthContext, ThemeContext
├── types/            — shared TypeScript interfaces mirroring API DTOs
├── utils/            — formatters, role guard
└── styles/           — global CSS, design tokens
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |

## Roles

Access to the admin dashboard requires a user account with the `Admin` or `SuperAdmin` role. Moderators have read-only access to the reviews and flagged content sections. Role enforcement happens both in the UI (route guards) and on the API.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the RestStop API |

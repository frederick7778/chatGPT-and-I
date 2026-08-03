# ToolKit AI

A modern AI productivity platform where users discover and use productivity tools, earn credits, build daily streaks, and maintain a personalized workspace. Built as a scalable startup-ready foundation with retention-first design.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ai-productivity run dev` — run the frontend (PORT from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session cookie secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, shadcn/ui, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Session cookies + bcryptjs
- Validation: Zod (v3), drizzle-zod
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/ai-productivity/src/pages/` — All pages (index, login, register, dashboard, tools, tools/[slug], history, favorites, credits, profile)
- `artifacts/ai-productivity/src/components/app-shell.tsx` — Persistent sidebar layout + auth guard
- `artifacts/api-server/src/routes/` — API route handlers (auth, credits, streaks, tools, history, favorites, dashboard)
- `artifacts/api-server/src/lib/auth.ts` — Session/cookie auth helpers
- `artifacts/api-server/src/lib/tools.ts` — Static tool catalog (5 tools)
- `lib/db/src/schema/` — Drizzle DB schemas (users, sessions, credits, streaks, history, favorites)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)

## Architecture decisions

- **Session cookie auth** — httpOnly cookies with bcryptjs for password hashing. No JWT, no localStorage. 30-day sessions.
- **Static tool catalog** — Tools are defined in `lib/tools.ts` as a static array, not DB records. Add new tools there.
- **Credits seeded on registration** — New users start with 100 credits to reduce cold-start friction.
- **Zod v3 in OpenAPI spec** — Orval 8.23 generates zod v4 syntax; spec uses `type: number` (not `integer`) and no `format: email` to stay compatible with the pinned zod v3 catalog entry.

## Product

- **Landing page** — Dark, animated marketing page with hero, feature grid, CTA
- **Auth** — Register/Login with email + password. Session persists 30 days.
- **Dashboard** — Streak widget, daily check-in reward button, credits balance, recent history, favorite tools, stats
- **Tools catalog** — Grid of 5 tools (QR Code, Password, Word Counter, Resume Builder, Invoice Generator) with search + category filters + favorites toggle
- **Tool pages** — Each tool is fully functional with real output. After use, saves to history.
- **History** — Searchable log of all tool runs with delete
- **Favorites** — Saved tools for quick access
- **Credits** — Balance, transaction log, earned/spent stats
- **Streak system** — Daily check-ins extend streak, longer streaks earn more credits (5–25/day)
- **Profile** — Update name and bio

## User preferences

- Focus on retention: daily rewards, streaks, credits make users come back
- Mobile-first, dark UI with electric violet/purple palette

## Gotchas

- Do not use `format: email` or `type: integer` in OpenAPI spec — Orval generates zod v4 syntax which is incompatible with the pinned zod v3
- Run `pnpm --filter @workspace/api-spec run codegen` after every OpenAPI spec change
- bcrypt (native) is blocked by pnpm build scripts approval — use bcryptjs instead
- Cookie `sameSite: "lax"` is used in production; `secure` only in production mode

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

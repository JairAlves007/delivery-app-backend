# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (tsx --watch, port 3333)
pnpm build            # Compile TS + resolve path aliases (tsc && tsc-alias)
npx eslint . --fix    # Lint and auto-fix
pnpm db:migrate       # Run Prisma migrations
pnpm db:studio        # Open Prisma Studio
```

Always run `pnpm build` after changes to verify compilation. Always run `npx eslint . --fix` to ensure linting passes.

## Tech Stack

Node.js 24 | TypeScript 5.9 (strict) | Fastify 5 | Prisma 7 (`@prisma/adapter-pg`) | PostgreSQL 16 | Redis 7 (`ioredis`) | BullMQ | Zod 4 | Resend | Cloudflare R2 | pnpm | ESM (`"type": "module"`)

## Architecture

Multi-tenant food delivery SaaS backend. Tenancy is by `establishment_id`, carried in JWT (`activeTenantId`, `primaryTenantId`).

**Request flow:** Route → Middleware (`isAuthenticated`, `ensureUserHasPermission`) → Controller (Zod parse → factory → service.handle()) → Reply (`ApiResponse.success()` / `reply.sendError()`)

### Key directories (`src/`)

| Layer          | Path                                 | Pattern                                                                                    |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Entrypoint     | `http/app.ts`, `http/server.ts`      | Plugin registration order matters                                                          |
| Routes         | `routes/{admin,api,health}/`         | Grouped by domain, prefixed `/api`                                                         |
| Controllers    | `controllers/`                       | Exported arrow functions, not classes. CRUD: `index`, `find`, `store`, `update`, `destroy` |
| Services       | `services/`                          | Classes with `handle()` method, one per use case, DI via constructor                       |
| Repositories   | `repositories/`                      | `XxxPrismaRepository` implements `IXxxRepository`, soft delete (`deleted_at: null`)        |
| Factories      | `factories/{repositories,services}/` | `makeXxxRepository()`, `makeXxxService()` — always use these, never instantiate directly   |
| Schemas        | `schemas/`                           | Zod v4 schemas per domain, pt-BR messages                                                  |
| Queues/Workers | `queues/`, `workers/`                | BullMQ queues; workers initialized on Fastify `onReady` hook                               |
| Classes        | `classes/`                           | Singletons: `Cache` (Redis), `Mail` (Resend+EJS), `BaseQueue` (BullMQ)                     |
| Lib            | `lib/`                               | Client singletons: Prisma, Redis, Resend, R2                                               |

## Critical Conventions

- **ESM only** — imports must use `.js` extension: `import { env } from "@/env.js"`
- **Path alias** — `@/` maps to `src/` (tsconfig paths + tsc-alias)
- **No `any`**, no comments in code, no default exports (prefer named)
- **Arrow functions** over regular functions; early returns over nested ifs
- **kebab-case** filenames; PascalCase classes; camelCase variables/functions
- **Never use** `process.env` directly (use `src/env.ts`), Prisma in controllers (use repos), email in controllers (use queues), `require()`, `cuid()` (use `ulid()`)
- **Never expose** `password` fields in responses
- **Zod v4** — use `z.iso.date()`, `z.iso.datetime()`, `z.iso.time()` instead of regex
- **>2 params** → receive an object
- **Errors** extend `ErrorBase`; handled centrally via `replySendError` plugin (ZodError→422, ErrorBase→custom status, Prisma P2002→409/P2025→404, else→500)
- **Responses**: `ApiResponse.success(msg, details)` / `ApiResponse.error(error, details)` — never return raw objects from routes
- **Prisma**: snake_case DB columns via `@map`/`@@map`, IDs use `ulid()`, soft delete, timestamps with `@db.Timestamptz`
- **Cache keys** defined in `Constants.CACHE_KEYS`; invalidation via `cache-queue`
- **Admin routes** require `onRequest: [isAuthenticated, ensureUserHasPermission([...])]`

## API Docs

Swagger + Scalar UI available at `/docs` in dev mode.

## Agent Auto-Routing

When a task is described, automatically select the most relevant agent from `.claude/agents/registry.md` without asking. Apply that agent's enforced rules throughout execution. Only mention agent selection if genuinely ambiguous.

Routing: match task keywords → select agent → enforce agent's rules → execute.

Security-auditor has veto power over all agents. Multi-domain tasks: primary agent leads, others validate their domain.

See `.claude/agents/registry.md` for full routing table and keyword matching.

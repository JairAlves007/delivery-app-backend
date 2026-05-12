# Agent Registry

## Routing Table

| Agent | Keywords | Enforced Rules |
|-------|----------|----------------|
| **backend-engineer** | route, controller, service, repository, factory, middleware, endpoint, API, Fastify, BullMQ, queue, worker | Follow CLAUDE.md conventions exactly: factories, arrow fns, no `any`, ESM `.js` imports, `ulid()`, `ApiResponse`, `ErrorBase` |
| **db-architect** | schema, migration, Prisma, model, relation, index, column, table, seed, soft delete | snake_case columns, `@map`/`@@map`, `@db.Timestamptz`, soft delete (`deleted_at`), `ulid()` IDs, no raw SQL unless necessary |
| **security-auditor** | auth, JWT, permission, token, password, role, tenant, RBAC, vulnerability, expose, leak | Veto power over all agents. Check: no `password` in responses, `isAuthenticated` + `ensureUserHasPermission` on admin routes, no `process.env` direct access |
| **cache-engineer** | cache, Redis, invalidate, TTL, `Cache`, `Constants.CACHE_KEYS`, BullMQ cache-queue | Use `Cache.getInstance()` only, keys via `Constants.CACHE_KEYS`, invalidation via `cache-queue` |
| **infra-engineer** | env, deploy, Docker, R2, Cloudflare, SMTP, Resend, config, environment variable | Use `src/env.ts`, never `process.env` direct |

## Routing Rules

1. Match task description keywords → select agent above
2. Apply that agent's enforced rules throughout execution
3. Only mention agent selection if genuinely ambiguous
4. **security-auditor has veto power** over all agents — always validates auth/exposure concerns
5. Multi-domain tasks: primary agent leads, security-auditor validates its domain

## Examples

- "add route to list orders" → backend-engineer
- "add index to orders table" → db-architect
- "cache product list" → cache-engineer + backend-engineer
- "add JWT expiry check" → security-auditor leads
- "new env var for feature flag" → infra-engineer

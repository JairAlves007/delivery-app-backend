---
trigger: always_on
---

# System Prompt — Backend Engineer (Node.js Stack)

Você é um engenheiro de software backend sênior especializado em aplicações Node.js modernas com TypeScript. Siga rigorosamente os padrões aqui descritos.

## Stack Tecnológica

Node.js 24.x | TypeScript 5.9 (strict) | Fastify 5.x | Prisma 7.x (`@prisma/adapter-pg`) | PostgreSQL 16 | Redis 7.x (`ioredis`) | BullMQ | Zod 4.x | Resend | Cloudflare R2 (`@aws-sdk/client-s3`) | pnpm | ESM (`"type": "module"`) | tsx (dev) | tsc + tsc-alias (build) | ESLint + Prettier | Pino (`pino-pretty`) | Docker Compose

## Princípios Gerais

- **TypeScript strict** — nenhum `any` implícito; tipos explícitos ou inferidos com segurança.
- **Clean Code** — funções pequenas, nomes descritivos, sem código morto.
- **SOLID** — responsabilidade única, inversão de dependência via interfaces e factories.
- **Fail-fast** — valide com Zod o mais cedo possível, retorne erros claros.
- **Imutabilidade** — prefira `const`, evite mutações desnecessárias.
- **Sem magic strings** — use `Constants`, `HTTPStatusCodes`, enums Prisma ou tipos literais.
- **ESM nativo** — imports sempre com extensão `.js` (ex: `import { env } from "@/env.js"`).
- **Path alias** — `@/` = `src/` (via `tsconfig.json` paths + `tsc-alias`).

## Arquitetura (`src/`)

| Diretório                            | Função                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `@types/`                            | Augmentação de tipos (Fastify, JWT)                                       |
| `classes/`                           | Singletons reutilizáveis: `Cache`, `Mail`, `BaseQueue`                    |
| `controllers/`                       | Funções request/reply: validação Zod + chamada de services                |
| `errors/`                            | Classes de erro por domínio (estendem `ErrorBase`)                        |
| `factories/{repositories,services}/` | `makeXxxRepository()` e `makeXxxService()`                                |
| `generated/`                         | Prisma Client gerado                                                      |
| `helpers/`                           | Utilitários puros (constantes, formatação, validação)                     |
| `http/`                              | Entrypoint: `app.ts` + `server.ts`                                        |
| `interfaces/`                        | Contratos: `ICRUDBase`, `ICacheBase`, `IMail`, `IQueueProvider`           |
| `lib/`                               | Singletons de clients: Prisma, Redis, Resend, Cloudflare R2               |
| `mails/`                             | Templates EJS                                                             |
| `middlewares/`                       | Hooks: `isAuthenticated`, `ensureUserHasRoles`, `ensureUserHasPermission` |
| `plugins/`                           | Plugin `replySendError` (tratamento centralizado de erros)                |
| `queues/`                            | Definição de filas + funções de enqueue                                   |
| `repositories/`                      | Implementações Prisma dos repositórios                                    |
| `routes/{admin,api,health}/`         | Rotas agrupadas por domínio com prefixos                                  |
| `schemas/`                           | Schemas Zod por domínio                                                   |
| `services/`                          | Lógica de negócio (um service por caso de uso)                            |
| `types/`                             | Tipos TypeScript por domínio                                              |
| `workers/`                           | Workers BullMQ que processam jobs                                         |

## Fastify (`src/http/app.ts`)

Plugins registrados em ordem: `fastifyCors` → `fastifyJwt` → `replySendErrorPlugin` → `routes`. Workers inicializados no hook `onReady`. Error handler global: `reply.sendError(error)`. NotFound handler customizado.

### Rotas

```
/api
├── /health
├── /admin → auth, upload, establishment, products, product/category, district, banner, addon/category, addon, coupon, order
└── (público) → auth, main, coupon, address, order
```

Rotas admin usam middlewares `onRequest`:

```ts
const middlewares = {
  onRequest: [isAuthenticated, ensureUserHasPermission([PermissionType.XXX])],
};
app.get("/", middlewares, handler);
```

Convenções: `reply.status(code).send(payload)` — nunca retorne objetos. Sucesso via `ApiResponse.success(msg, details)`, erro via `reply.sendError(error)`.

## Controllers

Funções exportadas (não classes). Convenção CRUD: `index`, `find`, `store`, `update`, `destroy`.

Fluxo: 1) Zod `.parse()` → 2) `makeXxxService()` → 3) `service.handle()` em `try/catch` → 4) `reply.status().send(ApiResponse.success())` → 5) catch: `reply.sendError(error)`.

Ref: [addon-category.controller.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/controllers/addon-category.controller.ts)

## Services

Classe com método `handle()`. Dependências injetadas via construtor usando interfaces. Instanciados via factories. Um service por caso de uso, organizados por domínio em `src/services/`.

```ts
export class SendResetPasswordMailService {
  constructor(private mail: IMail) {}
  async handle(data: ResetPasswordMailData) {
    await this.mail.sendResetPasswordMail(data);
  }
}
```

## Factory Pattern

Factories instanciam repositórios e services: `src/factories/repositories/` → `makeXxxRepository()` | `src/factories/services/` → `makeXxxService()`.

```ts
export const makeAddonCategoryRepository = () =>
  new AddonCategoryPrismaRepository();
```

## Repositórios

Implementam `ICRUDBase<Model, CreateData, UpdateData, Id, ReturningModel>` com métodos: `listAll`, `count`, `paginate`, `findById`, `create`, `update`, `delete`.

Convenções: soft delete (`deleted_at: null` em queries), busca/ordenação/paginação via `filterParams`, nomenclatura `XxxPrismaRepository` implementa `IXxxRepository`.

Refs: [crud-base.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/interfaces/crud-base.ts) | [addon-category-prisma-repository.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/repositories/addon-category-prisma-repository.ts)

## Classes Base

**Cache** (`src/classes/cache.ts`) — Singleton Redis. Métodos: `set`, `get`, `forget`, `flush`, `forgetKeysContaining` (SCAN), `remember` (cache-aside + TTL), `rememberForever`, `forgetAllListingCacheKeys`. Chaves em `Constants.CACHE_KEYS`.

**BaseQueue** (`src/classes/queue.ts`) — Singleton por fila sobre BullMQ. `BaseQueue.getInstance<T>(name)`, `enqueue(jobName, data)`, `registerProcessor(handler)`. Config: 3 tentativas, backoff exponencial, remove ao completar/falhar.

**Mail** (`src/classes/mail.ts`) — Singleton Resend + EJS. Templates em `src/mails/`. Renderiza via `ejs.renderFile()`.

## Filas e Workers

| Fila                  | Jobs                                                          |
| --------------------- | ------------------------------------------------------------- |
| `cache-queue`         | `forget-all-listing-cache-keys`                               |
| `mail-queue`          | `send-order-confirmation-message`, `send-reset-password-mail` |
| `establishment-queue` | Criação de menu para novo establishment                       |
| `order-queue`         | Criação de pedidos                                            |

Workers: funções `setupXxxWorker()` em `src/workers/`, inicializados no `setupWorkers()` → hook `onReady`. Ref: [send-reset-password-mail-worker.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/workers/mail/send-reset-password-mail-worker.ts)

## Middlewares (`src/middlewares/`)

- `isAuthenticated` — verifica JWT (`request.jwtVerify`)
- `ensureUserHasRoles(roles)` — verifica role via token
- `ensureUserHasPermission(permissions)` — verifica permissões via banco

## Prisma

Prisma 7.x + `@prisma/adapter-pg`. Client gerado em `src/generated/prisma/`. Singleton com cache global em [prisma.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/lib/prisma.ts). Config: [prisma.config.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/prisma.config.ts).

Convenções: `@map`/`@@map` para snake_case | IDs: `ulid()` (principais), `autoincrement()` (auxiliares) | `select`/`omit` para omitir `password` | soft delete com `deleted_at` | timestamps com `@db.Timestamptz` | acesso somente via repositórios.

## Multi-Tenancy

Multi-tenant por `establishment_id`. JWT carrega `activeTenantId` e `primaryTenantId`. Controllers: `request.user.primaryTenantId` / `request.user.activeTenantId`. Queries filtram por `establishment_id`.

## Redis, Resend, Cloudflare R2

**Redis** — Singleton `ioredis` em `src/lib/redis.ts`. Cache via classe `Cache`. Invalidação via fila `cache-queue`.

**Resend** — Singleton em `src/lib/mail.ts`. Envio via classe `Mail` + workers BullMQ. Nunca enviar diretamente em controllers.

**R2** — Client S3 em `src/lib/cloudflare.ts`. Upload via pre-signed URLs (`SignedUrl` em `src/helpers/signed-url.ts`). Recursos rastreados via model `Resource` + tabelas pivot.

## Schemas Zod (`src/schemas/`)

Schemas por domínio com mensagens em pt-BR. Genéricos em [generic-schema.ts](file:///Users/macbookpro/workspace/personal-projects/delivery-saas/delivery-micro-saas-backend/src/schemas/generic-schema.ts): `listQueryParamsSchema` (offset, admin), `listCursorQueryParamsSchema` (cursor, catálogo), `establishmentParamsSchema`, `userIdSchema`, `userEmailSchema`, `phoneSchema`, `addressLocationSchema`. Validação sempre no controller.

## Tratamento de Erros

`ErrorBase` (`statusCode`, `name`) estende `Error`. Erros customizados por domínio em `src/errors/`.

Plugin `replySendError` hierarquia: 1) `ZodError` → 422 + `beautifyValidationErrors` | 2) `ErrorBase` → status do erro | 3) `PrismaClientKnownRequestError` → P2002 (409), P2025 (404) | 4) `Error` → 500.

Respostas: `ApiResponse.success(msg, details?)` → `{ success, message, details }` | `ApiResponse.error(error, details?)` → `{ success, code, details }`.

## Type Augmentation

JWT payload (`src/@types/fastify-jwt.d.ts`): `user: { sub, activeTenantId, primaryTenantId?, role }`.
FastifyRequest (`src/@types/fastify.d.ts`): `role: RoleType`.
FastifyReply (plugin): `sendError(error) => FastifyReply`.

## Variáveis de Ambiente (`src/env.ts`)

Obrigatórias: `PUBLIC_BUCKET_URL`, `APP_URL`, `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `JWT_SECRET`, `CLOUDFLARE_ENDPOINT`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET_NAME`, `RESEND_API_KEY`.

Com default: `NODE_ENV` (development), `PORT` (3333), `BASE_URL` (http://localhost:3333), `CORS_ORIGIN` (\*), `REDIS_HOST` (127.0.0.1), `REDIS_PORT` (6379).

Opcional: `REDIS_PASSWORD`.

## Helpers (`src/helpers/`)

`api.ts` (ApiResponse) | `constants.ts` (Constants) | `crud.ts` (filtros/paginação) | `date.ts` | `establishment.ts` (horário) | `http-request-codes.ts` (HTTPStatusCodes) | `order.ts` (mensagens) | `price.ts` (centavos) | `resource.ts` (imagens) | `signed-url.ts` (SignedUrl) | `utils.ts` | `validation-errors.ts` (erros Zod + CNPJ)

## O que NUNCA fazer

- ❌ `any` sem justificativa | ❌ Expor `password` | ❌ `process.env` direto (use `env.ts`) | ❌ Prisma em controllers (use repositórios) | ❌ E-mail em controllers (use filas) | ❌ E-mail sem `try/catch` | ❌ Rotas sem Zod | ❌ Stack traces em produção | ❌ Instanciar services/repos direto (use factories) | ❌ `require()` (ESM) | ❌ Import sem `.js` | ❌ `cuid()` (use `ulid()`)

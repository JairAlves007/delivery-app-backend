# ---------- base ----------
FROM node:24-bookworm-slim AS base
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install -g pnpm@11.8.0
WORKDIR /app

# ---------- deps (dev + prod, necessarias para o build) ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---------- build ----------
FROM deps AS build
COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src
RUN pnpm prisma generate
RUN pnpm build

# ---------- deps de producao ----------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod

# ---------- migrator (one-shot: prisma migrate deploy) ----------
FROM build AS migrator
CMD ["pnpm", "prisma", "migrate", "deploy"]

# ---------- runner (aplicacao) ----------
FROM node:24-bookworm-slim AS runner
ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-liberation \
      fonts-noto-color-emoji \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3333
CMD ["node", "dist/http/server.js"]

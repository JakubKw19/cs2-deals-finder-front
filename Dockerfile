# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

# Copy manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend-next/package.json ./frontend-next/
COPY backend/package.json ./backend/

# Install all deps (cached)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build frontend
RUN pnpm --filter frontend-next build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Copy production node_modules (pruned)
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

COPY --from=builder /app/node_modules/ ./node_modules/

COPY --from=builder /app/packages ./packages

# Copy built app
COPY --from=builder /app/frontend-next/package.json ./frontend-next/
COPY --from=builder /app/frontend-next/.next ./frontend-next/.next
COPY --from=builder /app/frontend-next/public ./frontend-next/public

WORKDIR /app/frontend-next

RUN pnpm install --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]

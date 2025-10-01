# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy monorepo manifests first (better caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend-next/package.json ./frontend-next/
COPY backend/package.json ./backend/
COPY packages/*/package.json ./packages/*/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the frontend
RUN pnpm --filter frontend-next build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app/frontend-next
ENV NODE_ENV=production

RUN corepack enable

# Copy built artifacts
COPY --from=builder /app/frontend-next/.next .next
COPY --from=builder /app/frontend-next/public ./public
COPY --from=builder /app/frontend-next/package.json ./
COPY --from=builder /app/packages ../packages

# Install only production deps
RUN pnpm install --frozen-lockfile --prod --link-workspace-packages

EXPOSE 3000
CMD ["pnpm", "start"]

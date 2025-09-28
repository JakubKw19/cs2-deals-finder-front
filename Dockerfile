
# Stage 1: Dependency Installation and Build 
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy monorepo root files
COPY frontend-next/package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy all source code directories
COPY packages/ packages/
COPY backend/ backend/
COPY frontend-next/ frontend-next/

# Install all workspace dependencies
RUN pnpm install

# Build the frontend-next workspace
RUN pnpm --filter frontend-next build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app/frontend-next
ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy frontend-next package files
COPY frontend-next/package.json ./

COPY --from=builder /app/frontend-next/.next .next 
COPY --from=builder /app/frontend-next/package.json . 
COPY --from=builder /app/frontend-next/public ./public 
COPY --from=builder /app/packages ./packages

# Install only production dependencies but include linked packages
RUN pnpm install --prod --link-workspace-packages

EXPOSE 3000
CMD ["pnpm", "start"]
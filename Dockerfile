# --- STAGE 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lockfile for workspace-aware install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy workspace packages/apps to install their specific deps
COPY apps/demo-agency-portal/package.json ./apps/demo-agency-portal/
COPY packages/core/package.json ./packages/core/
COPY packages/db/package.json ./packages/db/
COPY plugins/hello-world/package.json ./plugins/hello-world/
COPY plugins/cms/package.json ./plugins/cms/
COPY plugins/users-roles/package.json ./plugins/users-roles/

RUN pnpm install --frozen-lockfile

# --- STAGE 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
# Copy everything from deps
COPY --from=deps /app ./
COPY . .

# Install pnpm in builder
RUN npm install -g pnpm

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app (assuming demo-agency-portal is the main entry)
RUN pnpm build
RUN pnpm --filter @logacore/core run bundle:migrations

# --- STAGE 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY the standalone folder and then the static assets into their proper locations.
COPY --from=builder /app/apps/demo-agency-portal/public ./apps/demo-agency-portal/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/demo-agency-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/demo-agency-portal/.next/static ./apps/demo-agency-portal/.next/static

# Copy plugins and core migrations (SQL files) 
COPY --from=builder --chown=nextjs:nodejs /app/plugins ./plugins
COPY --from=builder --chown=nextjs:nodejs /app/migrations ./migrations
# Copy the compiled migration runner (bundled)
COPY --from=builder --chown=nextjs:nodejs /app/packages/core/dist/migrations/runner.bundle.js ./packages/core/dist/migrations/runner.bundle.js
# Copy the startup script
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-start.sh ./scripts/docker-start.sh
RUN chmod +x ./scripts/docker-start.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use the startup script
CMD ["sh", "./scripts/docker-start.sh"]

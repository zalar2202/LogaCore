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

RUN pnpm install --frozen-lockfile

# --- STAGE 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/demo-agency-portal/node_modules ./apps/demo-agency-portal/node_modules
COPY . .

# Install pnpm in builder
RUN npm install -g pnpm

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app (assuming demo-agency-portal is the main entry)
RUN pnpm build

# --- STAGE 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions
# We only copy the standalone build and static files
COPY --from=builder /app/apps/demo-agency-portal/public ./apps/demo-agency-portal/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/demo-agency-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/demo-agency-portal/.next/static ./apps/demo-agency-portal/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start server.js created by Next.js standalone output
CMD ["node", "server.js"]

#!/bin/sh

echo "🚀 Starting LogaCore..."
echo "📂 Current directory: $(pwd)"
echo "📡 Checking database connection..."

# Run migrations
# We use || true to ensure that even if migrations fail, the server tries to start
# (This prevents the restart loop so you can actually see the logs)
echo "🏃 Running migrations..."
node packages/core/dist/src/migrations/runner.js || echo "⚠️ Migrations failed, but attempting to start server anyway..."

echo "🌐 Starting Next.js server..."
# Start the Next.js server (standalone mode)
node apps/demo-agency-portal/server.js

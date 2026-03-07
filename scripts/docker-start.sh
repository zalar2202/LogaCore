#!/bin/sh

echo "🚀 Starting LogaCore Service..."
echo "📂 Working directory: $(pwd)"

# 1. Run migrations
echo "📡 Initializing database migrations..."
# Use the bundled runner which contains all dependencies (pg, glob)
node ./packages/core/dist/migrations/runner.bundle.js || {
  echo "⚠️ Migrations reported an error, but we'll try to start the server anyway to allow log inspection."
}

# 2. Start the application
echo "🌐 Starting Next.js Production Server..."
# Standalone server is at /app/apps/demo-agency-portal/server.js in Next.js 14+
node ./apps/demo-agency-portal/server.js

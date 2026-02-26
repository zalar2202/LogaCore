#!/bin/sh

echo "🚀 Starting LogaCore Service..."
echo "📂 Working directory: $(pwd)"

# 1. Run migrations
echo "📡 Initializing database migrations..."
# Use absolute path relative to /app
node ./packages/core/dist/src/migrations/runner.js || {
  echo "⚠️ Migrations reported an error, but we'll try to start the server anyway to allow log inspection."
}

# 2. Start the application
echo "🌐 Starting Next.js Production Server..."
# Standalone server is at /app/apps/demo-agency-portal/server.js in Next.js 14+
node ./apps/demo-agency-portal/server.js

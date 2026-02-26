# LogaCore – Deployment Guide (v0.1)

This guide covers how to deploy LogaCore to a staging environment (e.g., Coolify).

## 1. Prerequisites

- A PostgreSQL instance (managed by Coolify or external).
- Environmental variables configured (see `.env.example`).

## 2. Docker Deployment

The project includes a `Dockerfile` optimized for monorepo standalone builds.

- **Context**: Root of the monorepo (`.`)
- **Dockerfile**: `./Dockerfile`

### Required Environment Variables

- `DATABASE_URL`: Connection string to the staging DB.
- `NEXTAUTH_SECRET`: Secret for authentication.
- `NEXTAUTH_URL`: The public URL of the application.
- `NEXT_PUBLIC_APP_URL`: Same as `NEXTAUTH_URL` for frontend usage.

## 3. Database Migrations

In staging, migrations must be run manually or as part of the CI/CD pipeline.

### Manual Execution

If you have shell access to the container:

```bash
docker exec -it <container_id> pnpm db:migrate
```

*(Note: Ensure dependencies like `tsx` are available if running from source, but in production we should ideally use compiled migrations. In v0.1, the runner uses `tsx`.)*

### pipeline Execution (Recommended)

In Coolify, you can add a "Post-deployment" or "Pre-deployment" command:

```bash
pnpm db:migrate
```

## 4. Health Checks

The application provides a health endpoint at:
`https://your-domain.com/api/health`

This returns:
```json
{
  "status": "ok",
  "timestamp": "...",
  "env": "production"
}
```

## 5. Scaling

In v0.1, scaling is vertical. Horizontal scaling requires session management (e.g., Redis) which is not yet in scope.

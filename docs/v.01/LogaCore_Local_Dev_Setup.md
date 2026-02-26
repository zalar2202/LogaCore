# LogaCore Local Development Setup

This guide covers how to set up your local environment for LogaCore development, specifically focusing on the database.

## Database (PostgreSQL)

We use Docker Compose to manage a local PostgreSQL instance for development.

### How to Start the Database

Run the following command from the project root:

```bash
pnpm db:dev:up
```

This will start a PostgreSQL container named `logacore-db-dev` on port `5432`.

### How to Stop the Database

To stop the database without removing data:

```bash
pnpm db:dev:down
```

### How to Reset the Database

To remove the database and all its data (volumes):

```bash
pnpm db:dev:reset
```

### Connection String Format

The default connection string for local development is:

```
postgresql://postgres:password@localhost:5432/logacore?schema=public
```

Make sure your `.env` file reflects this.

### Health Check

You can verify if the database is running and reachable using:

```bash
pnpm db:check
```

## Environment Variables

Ensure you have a `.env` file in the root directory. You can copy it from `.env.example`:

```bash
cp .env.example .env
```

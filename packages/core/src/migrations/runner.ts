import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const DATABASE_URL = process.env.DATABASE_URL;

async function runMigrations() {
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL is not defined in environment variables.');
        process.exit(1);
    }

    console.log('🔄 Starting migration runner...');
    console.log(`📂 Current working directory: ${process.cwd()}`);

    const client = new Client({
        connectionString: DATABASE_URL,
        connectionTimeoutMillis: 5000,
    });

    let connected = false;
    let retries = 5;

    while (!connected && retries > 0) {
        try {
            await client.connect();
            connected = true;
            console.log('✅ Connected to database for migrations.');
        } catch (err: any) {
            retries--;
            console.warn(`⚠️ Database connection failed (${err.message}). Retrying in 5 seconds... (${retries} retries left)`);
            if (retries === 0) {
                console.error('❌ Could not connect to database after multiple attempts.');
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }

    try {
        // 1. Ensure logacore_migrations table exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS logacore_migrations (
        id SERIAL PRIMARY KEY,
        plugin_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(plugin_id, filename)
      );
    `);

        // 2. Discover migrations in plugins/*
        const pluginsPath = path.resolve(process.cwd(), 'plugins');
        console.log(`🔍 Searching for migrations in: ${pluginsPath}`);

        if (!fs.existsSync(pluginsPath)) {
            console.log('ℹ️ No plugins directory found. Skipping migrations.');
            return;
        }

        const migrationFiles = await glob('*/migrations/*.sql', {
            cwd: pluginsPath,
            absolute: true,
        });

        // Sort by filename (numeric prefix)
        migrationFiles.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

        console.log(`🔍 Found ${migrationFiles.length} migration(s).`);

        for (const filePath of migrationFiles) {
            const filename = path.basename(filePath);
            const parts = filePath.split(path.sep);
            // Assuming structure: .../plugins/<pluginId>/migrations/<filename>
            const pluginId = parts[parts.length - 3];

            // 3. Check if already applied
            const res = await client.query(
                'SELECT id FROM logacore_migrations WHERE plugin_id = $1 AND filename = $2',
                [pluginId, filename]
            );

            if (res.rows.length > 0) {
                console.log(`⏩ Skipping ${pluginId}/${filename} (already applied).`);
                continue;
            }

            console.log(`🚀 Applying ${pluginId}/${filename}...`);
            const sql = fs.readFileSync(filePath, 'utf-8');

            try {
                await client.query('BEGIN');
                await client.query(sql);
                await client.query(
                    'INSERT INTO logacore_migrations (plugin_id, filename) VALUES ($1, $2)',
                    [pluginId, filename]
                );
                await client.query('COMMIT');
                console.log(`✅ Successfully applied ${pluginId}/${filename}.`);
            } catch (err: any) {
                await client.query('ROLLBACK');
                console.error(`❌ Failed to apply ${pluginId}/${filename}: ${err.message}`);
                process.exit(1);
            }
        }

        console.log('🏁 All migrations processed.');
    } catch (err: any) {
        console.error(`❌ Migration runner failed: ${err.message}`);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();

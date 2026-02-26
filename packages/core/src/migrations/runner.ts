import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined in .env');
    process.exit(1);
}

async function runMigrations() {
    const client = new Client({
        connectionString: DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('✅ Connected to database for migrations.');

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

        // Check if plugins directory exists
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
            const pluginId = path.basename(path.dirname(path.dirname(filePath)));

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

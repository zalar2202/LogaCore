#!/usr/bin/env node

import { cac } from 'cac';
import chalk from 'chalk';
import enquirer from 'enquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import Handlebars from 'handlebars';

const cli = cac('logacore');

cli
    .command('plugin:create [name]', 'Create a new LogaCore plugin')
    .action(async (name: string | undefined) => {
        try {
            const response: any = await enquirer.prompt([
                {
                    type: 'input',
                    name: 'id',
                    message: 'Plugin ID (e.g. blog, commerce):',
                    initial: name?.toLowerCase().replace(/ /g, '-'),
                    validate: (val: string) => /^[a-z0-9-]+$/.test(val) || 'ID must be alphanumeric and hyphenated'
                },
                {
                    type: 'input',
                    name: 'name',
                    message: 'Plugin Name (Display):',
                    initial() {
                        const id = (this as any).state.answers.id;
                        return id.charAt(0).toUpperCase() + id.slice(1);
                    }
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Plugin Description:',
                    initial: 'A new LogaCore plugin.'
                }
            ]);

            const pluginDir = path.resolve(process.cwd(), 'plugins', response.id);

            if (await fs.pathExists(pluginDir)) {
                console.error(chalk.red(`Error: Directory plugins/${response.id} already exists.`));
                process.exit(1);
            }

            const spinner = ora('Scaffolding plugin...').start();

            // Create structure
            await fs.ensureDir(path.join(pluginDir, 'src/api'));
            await fs.ensureDir(path.join(pluginDir, 'src/pages'));
            await fs.ensureDir(path.join(pluginDir, 'src/db'));
            await fs.ensureDir(path.join(pluginDir, 'migrations'));

            // 1. package.json
            const pkg = {
                name: `@logacore/plugin-${response.id}`,
                version: "0.1.0",
                private: true,
                main: "./src/index.ts",
                exports: {
                    ".": "./src/index.ts",
                    "./api": "./src/api/router.ts"
                },
                dependencies: {
                    "@logacore/core": "workspace:*",
                    "@logacore/db": "workspace:*"
                },
                devDependencies: {
                    "@types/node": "^20.19.34",
                    "@types/react": "^19.2.14",
                    "drizzle-orm": "^0.45.1",
                    "react": "^19",
                    "zod": "^3.25.76",
                    "typescript": "^5.3.0"
                }
            };
            await fs.writeJSON(path.join(pluginDir, 'package.json'), pkg, { spaces: 2 });

            // 2. index.ts
            const indexContent = `import { definePlugin } from '@logacore/core';

export const plugin = definePlugin({
    id: '${response.id}',
    name: '${response.name}',
    version: '0.1.0',
    requiredCoreVersion: '^0.1.0',
    description: '${response.description}',

    permissions: [
        {
            key: '${response.id}.read',
            name: 'Read ${response.name}',
            description: 'Can view ${response.id} content',
        },
        {
            key: '${response.id}.write',
            name: 'Write ${response.name}',
            description: 'Can edit ${response.id} content',
        }
    ],

    admin: {
        navItems: [
            {
                id: '${response.id}-list',
                label: '${response.name}',
                href: '/admin/${response.id}',
                requiredPerms: ['${response.id}.read'],
            },
        ],
        pages: [
            {
                id: '${response.id}-main',
                path: '/admin/${response.id}',
                component: () => null, // Placeholder
                requiredPerms: ['${response.id}.read'],
                title: '${response.name}',
            },
        ],
    },

    db: {
        migrationsPath: './migrations',
    },
});
`;
            await fs.writeFile(path.join(pluginDir, 'src/index.ts'), indexContent);

            // 3. api/router.ts
            const routerContent = `import { createRouter, protectedProcedure } from '@logacore/core/trpc';
import { z } from 'zod';

export const router = createRouter({
    hello: protectedProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return { message: \`Hello from ${response.name}, \${input.name}!\` };
        }),
});
`;
            await fs.writeFile(path.join(pluginDir, 'src/api/router.ts'), routerContent);

            // 4. db/schema.ts
            const schemaContent = `import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const ${response.id.replace(/-/g, '_')}Items = pgTable('${response.id.replace(/-/g, '_')}_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
`;
            await fs.writeFile(path.join(pluginDir, 'src/db/schema.ts'), schemaContent);

            spinner.succeed(chalk.green(`Plugin ${response.id} created successfully at plugins/${response.id}`));

            console.log('\n' + chalk.cyan('Next steps:'));
            console.log(chalk.white(`  1. cd plugins/${response.id}`));
            console.log(chalk.white('  2. Implement your features in src/'));
            console.log(chalk.white('  3. pnpm install at the root to link the package'));
            console.log(chalk.white('  4. Run pnpm dev to start developing!'));

        } catch (err) {
            console.error(chalk.red('Error creating plugin:'), err);
            process.exit(1);
        }
    });

cli
    .command('migration:create <pluginId> [name]', 'Create a new migration for a plugin')
    .action(async (pluginId, name) => {
        try {
            const pluginDir = path.resolve(process.cwd(), 'plugins', pluginId);
            const migrationsDir = path.join(pluginDir, 'migrations');

            if (!(await fs.pathExists(pluginDir))) {
                console.error(chalk.red(`Error: Plugin plugins/${pluginId} does not exist.`));
                process.exit(1);
            }

            await fs.ensureDir(migrationsDir);

            // Get existing migrations to determine the next number
            const files = await fs.readdir(migrationsDir);
            const migrationFiles = files.filter(f => f.endsWith('.sql'));

            let nextNum = 1;
            if (migrationFiles.length > 0) {
                const numbers = migrationFiles
                    .map(f => parseInt(f.split('_')[0]))
                    .filter(n => !isNaN(n));
                if (numbers.length > 0) {
                    nextNum = Math.max(...numbers) + 1;
                }
            }

            const slug = (name || 'migration')
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, '');

            const filename = `${nextNum.toString().padStart(3, '0')}_${slug}.sql`;
            const filePath = path.join(migrationsDir, filename);

            const content = `-- Migration: ${name || 'New Migration'}
-- Created at: ${new Date().toISOString()}

-- Write your SQL here:
-- CREATE TABLE example (...);
`;

            await fs.writeFile(filePath, content);

            console.log(chalk.green(`\n✔ Migration created: `) + chalk.white(`plugins/${pluginId}/migrations/${filename}`));

        } catch (err) {
            console.error(chalk.red('Error creating migration:'), err);
            process.exit(1);
        }
    });

cli.help();
cli.version('0.1.0');

cli.parse();

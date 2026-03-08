import { NextResponse } from 'next/server';
import { db } from '@logacore/db';

/**
 * LogaCore Health Check
 * Used by Coolify/Caddy/Traefik to ensure the container is ready.
 */
export async function GET() {
    try {
        // 1. Check Database Connectivity
        // We run a simple raw query to ensure the connection is alive
        await db.execute('SELECT 1');

        return NextResponse.json(
            {
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '0.2.0-beta'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('❌ Health check failed:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
                timestamp: new Date().toISOString()
            },
            { status: 503 }
        );
    }
}

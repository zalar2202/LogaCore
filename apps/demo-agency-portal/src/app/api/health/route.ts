import { NextResponse } from 'next/server';
import { db } from '@logacore/db';

/**
 * LogaCore Health Check
 * Used by Coolify/Caddy/Traefik to ensure the container is ready.
 */
export async function GET() {
    return NextResponse.json(
        {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'logacore-demo-agency-portal'
        },
        { status: 200 }
    );
}

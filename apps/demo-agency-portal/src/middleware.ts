import { auth } from '@/lib/auth';

export default auth;

// Protect all /admin routes
export const config = {
    matcher: ['/admin/:path*'],
};

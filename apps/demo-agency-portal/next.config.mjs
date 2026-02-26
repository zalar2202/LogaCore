/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    // We need this to ensure Next.js can resolve peer dependencies in a monorepo
    experimental: {
        externalDir: true,
    },
};

export default nextConfig;

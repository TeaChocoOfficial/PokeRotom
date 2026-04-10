// -Path: "PokeRotom/client/next.config.ts"
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: false,
    transpilePackages: ['three'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10gb',
        },
    },
};

export default nextConfig;

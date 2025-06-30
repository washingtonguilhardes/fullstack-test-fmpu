import type { NextConfig } from 'next';

const apiUrlInternal = process.env.DRIVEAPP_API_URL_INTERNAL;

if (!apiUrlInternal) {
  throw new Error('DRIVEAPP_API_URL_INTERNAL is not set');
}

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: `${apiUrlInternal}/graphql`,
      },
      {
        source: '/api/gallery/upload',
        destination: `${apiUrlInternal}/gallery/upload`,
      },
      {
        source: '/api/gallery/output/:guid',
        destination: `${apiUrlInternal}/gallery/output/:guid`,
      },
    ];
  },
};
export default nextConfig;

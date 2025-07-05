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
        source: '/api/v1/:path*',
        destination: `${apiUrlInternal}/api/v1/:path*`
      }
    ];
  }
};
export default nextConfig;

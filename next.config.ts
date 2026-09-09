import type { NextConfig } from 'next';

/**
 * Configuration Next.js — GUESS ENERGY + SARL.
 * Les images produits sont servies par /api/products/[id]/image (BLOB SQL Server),
 * elles passent donc par la même origine : aucune configuration distante requise.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Préserver les gros BLOB images hors du cache de dev
    serverActions: { bodySizeLimit: '4mb' },
  },
  async headers() {
    return [
      {
        source: '/api/products/:id/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
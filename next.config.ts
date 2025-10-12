import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'velstana.com',
      },
      {
        protocol: 'https',
        hostname: 'oxhijwvviytndytvimmc.supabase.co',
      },
    ],
  },
};

export default nextConfig;
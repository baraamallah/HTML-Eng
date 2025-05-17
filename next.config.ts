
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', // Or 'http' if that's what nigas.com uses
        hostname: 'nigas.com',
        port: '',
        pathname: '/**', // You can make this more specific if needed
      },
    ],
  },
};

export default nextConfig;

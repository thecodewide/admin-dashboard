import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Increase payload size limits for file uploads
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '600kb', // Slightly above our 500KB limit
    },
  },
};

export default nextConfig;

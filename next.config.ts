import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

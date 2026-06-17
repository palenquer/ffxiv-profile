import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lds-img.finalfantasyxiv.com' },
      { protocol: 'https', hostname: 'img2.finalfantasyxiv.com' },
      { protocol: 'https', hostname: 'xivapi.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

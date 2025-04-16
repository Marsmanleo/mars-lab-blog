/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['admin.mars-lab.ltd'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.mars-lab.ltd',
        pathname: '/uploads/**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    path: '/_next/image',
    formats: ['image/webp'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://admin.mars-lab.ltd/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['mars-lab.ltd', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mars-lab.ltd',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://mars-lab.ltd/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig

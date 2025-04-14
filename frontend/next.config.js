/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['13.250.13.100'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '13.250.13.100',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig

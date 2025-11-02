/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}

export default nextConfig

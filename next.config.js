/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'woocommerce.quantico.cc',
      },
      {
        protocol: 'https',
        hostname: 'blog.gruponatos.com.br',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
    '@mapbox/mapbox-gl-geocoder',
    '@mapbox/mapbox-sdk',
    'keyv',
    'cacheable-request',
    'got'
  ],
  experimental: {
    serverComponentsExternalPackages: ['@mapbox/mapbox-sdk'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com', 'api.mapbox.com'],
  },
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
module.exports = {
  compress: true,
  images: {
    loader: 'custom',
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

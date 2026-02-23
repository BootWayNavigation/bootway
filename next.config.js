/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing.html',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

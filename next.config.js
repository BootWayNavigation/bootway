/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    GOG_CLNT_ID: process.env.GOG_CLNT_ID,
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

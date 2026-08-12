/** @type {import('next').NextConfig} */

// Static pages that live in /public but are served under an extension-less URL.
const staticPages = ['policy', 'research', 'calculator'];

const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    GOG_CLNT_ID: process.env.GOG_CLNT_ID,
  },
  async rewrites() {
    // beforeFiles so these win over the app router entries of the same path.
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/landing.html',
        },
        ...staticPages.map((page) => ({
          source: `/${page}`,
          destination: `/${page}.html`,
        })),
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/landing.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      ...staticPages.map((page) => ({
        source: `/${page}.html`,
        destination: `/${page}`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;

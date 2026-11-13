/** @type {import('next').NextConfig} */

// Static pages that live in /public but are served under an extension-less URL.
const staticPages = [
  'policy',
  'research',
  'calculator',
  'certifications',
  'hospital-navigation',
  'virtual-tours',
  'universities',
  'press',
  'about',
  'contact',
  'terms',
];

const guidePages = [
  'hospital-wayfinding-india',
  'qr-vs-beacon-navigation',
  'campus-navigation-open-days',
  'accessible-indoor-navigation',
  'virtual-tour-for-hospitals',
];

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
        {
          source: '/guides',
          destination: '/guides/index.html',
        },
        ...guidePages.map((slug) => ({
          source: `/guides/${slug}`,
          destination: `/guides/${slug}.html`,
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
      {
        source: '/guides/index.html',
        destination: '/guides',
        permanent: true,
      },
      // Catch-all: never leave .html visible in the address bar
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

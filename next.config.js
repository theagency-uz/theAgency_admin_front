/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    domains: ["spaces.parfumgallery.uz", "spaces.parfumgallery.uzundefined"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // trailingSlash: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/qr",
  //       destination: "/",
  //       permanent: false,
  //     },
  //   ];
  // },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     require("./scripts/sitemap-generator");
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);

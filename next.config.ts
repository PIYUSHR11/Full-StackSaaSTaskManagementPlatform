// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // swcMinify: true,  //delete this it is true by default
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ["react-icons", "date-fns"],
  },
};

module.exports = nextConfig;

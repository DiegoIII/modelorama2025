/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hebmx.vtexassets.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

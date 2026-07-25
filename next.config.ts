import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_R2_HOSTNAME || "pub-e69e7deaceef4f3b83e1b59b87a30b6c.r2.dev",
        pathname: "/avatars/**",
      },
    ],
  },
};

export default nextConfig;

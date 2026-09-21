import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product imagery may be seeded from Pexels or hosted on arbitrary CDNs;
    // the CRM also lets owners paste any image URL.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

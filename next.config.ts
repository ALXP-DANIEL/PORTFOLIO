import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.104"],
  experimental: {
    viewTransition: true,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Project images uploaded to the repo itself — the permanent host.
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      // Temporary placeholder hosts — remove once real repo images are in place.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;

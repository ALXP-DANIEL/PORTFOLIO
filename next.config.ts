import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    viewTransition: true,
  },
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.104"],
  experimental: {
    useTypeScriptCli: true,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Project images uploaded to the repo itself — the permanent host.
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      // Private client repositories expose their portfolio artwork from the
      // deployed business sites instead of unauthenticated GitHub raw URLs.
      { protocol: "https", hostname: "kampunghills.vercel.app" },
      { protocol: "https", hostname: "kopi-rumah-nenek.vercel.app" },
      // Temporary placeholder hosts — remove once real repo images are in place.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, immutable" },
          { key: "Content-Type", value: "application/json" }
        ]
      }
    ];
  }
};

export default nextConfig;


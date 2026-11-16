import type { NextConfig } from "next";
import photographMigration from "./src/lib/photographs.json";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/private/:path*", headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Cache-Control", value: "private, no-store" },
    ] }];
  },
  async redirects() {
    return photographMigration.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import photographMigration from "./src/lib/photographs.json";

const nextConfig: NextConfig = {
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

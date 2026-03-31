import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    // Explicitly set the turbopack root to fix the "compiling" issue and lockfile inference error
    turbopack: {
      root: path.resolve(__dirname),
    }
  } as any
};

export default nextConfig;

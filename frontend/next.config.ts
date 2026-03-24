import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the root or set relative path
  turbopack: {
    root: ".",  // <-- use current project folder
  },
};

export default nextConfig;
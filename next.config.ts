import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/v-prompt-library" : "",
  assetPrefix: isProd ? "/v-prompt-library/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

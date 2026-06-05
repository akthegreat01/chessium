import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.chess.com" },
      { protocol: "https", hostname: "lichess.org" },
    ],
  },
  async headers() {
    const crossOriginHeaders = [
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Cross-Origin-Embedder-Policy",
        value: "credentialless",
      },
    ];
    return [
      { source: "/analysis", headers: crossOriginHeaders },
      { source: "/play", headers: crossOriginHeaders },
      { source: "/endgames/:path*", headers: crossOriginHeaders },
      { source: "/drills/:path*", headers: crossOriginHeaders },
      { source: "/openings/:path*", headers: crossOriginHeaders },
      { source: "/master-games/:path*", headers: crossOriginHeaders },
      { source: "/guess-the-elo", headers: crossOriginHeaders },
      { source: "/vision", headers: crossOriginHeaders },
      { source: "/story/:path*", headers: crossOriginHeaders },
    ];
  },
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;

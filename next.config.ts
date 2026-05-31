import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  async headers() {
    const sharedArrayBufferHeaders = [
      {
        key: "Cross-Origin-Embedder-Policy",
        value: "require-corp",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
    ];
    
    return [
      {
        source: "/play/ai",
        headers: sharedArrayBufferHeaders,
      },
      {
        source: "/analyze",
        headers: sharedArrayBufferHeaders,
      },
      {
        source: "/stockfish/(.*)",
        headers: sharedArrayBufferHeaders,
      },
      {
        source: "/stockfish/stockfish.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          }
        ]
      }
    ];
  },
};

export default nextConfig;

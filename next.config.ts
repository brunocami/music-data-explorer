import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["i.scdn.co"], // ← dominio de imágenes de Spotify
  },
};

export default nextConfig;

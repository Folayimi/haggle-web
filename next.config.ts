import type { NextConfig } from "next";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const r2ImagePattern = r2PublicUrl
  ? (() => {
      const url = new URL(r2PublicUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL must use HTTP or HTTPS");
      }
      const basePath = url.pathname.replace(/\/+$/, "");
      return {
        protocol: url.protocol.slice(0, -1) as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: `${basePath}/**`,
      };
    })()
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "pub-12f9040e6e934025a9f53c78806dca57.r2.dev",
        pathname: "/products/**",
      },
      ...(r2ImagePattern ? [r2ImagePattern] : []),
    ],
  },
};

export default nextConfig;

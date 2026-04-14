import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/open-call", permanent: true },
      { source: "/blog/:slug", destination: "/open-call/:slug", permanent: true },
      { source: "/admin/blog/new", destination: "/admin/open-call/new", permanent: true },
      { source: "/admin/blog/:id", destination: "/admin/open-call/:id", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

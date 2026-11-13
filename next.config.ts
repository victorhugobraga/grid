import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' chrome-extension:",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;

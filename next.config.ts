import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Phase 3 addendum — the one route rename from the old app
      { source: "/certificates", destination: "/certifications", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Stage 7 TODO closed out — written now that the actual set of
            // third-party origins is known (only Cloudinary for images;
            // next/font self-hosts Google Fonts at build time, so no
            // fonts.googleapis.com/fonts.gstatic.com entry is needed).
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' res.cloudinary.com data:",
              "font-src 'self' data:",
              // 'unsafe-inline' on style-src is required for Tailwind's
              // arbitrary-value inline styles used throughout (e.g.
              // style={{ color: 'var(--color-primary)' }}) — a stricter
              // nonce-based approach is possible but a bigger refactor than
              // this hardening pass, noted rather than silently loosened
              // further than necessary.
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;

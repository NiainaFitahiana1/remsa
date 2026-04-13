/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: https:; " +
              "font-src 'self' data: https:; " +
              `connect-src 'self' https://*.vercel.app ${process.env.NEXT_PUBLIC_API_URL}; ` +
              "frame-src 'self';",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${API_URL}/auth/:path*`,
      },
      {
        source: "/api/deliveries/:path*",
        destination: `${API_URL}/deliveries/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${API_URL}/users/:path*`,
      },
      {
        source: "/api/:path*",
        destination: "/api/proxy/:path*",
      },
    ];
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.8.108:3000",
      ],
    },
  },

  allowedDevOrigins: [
    "http://192.168.8.108:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',           // Autorise tous les chemins
      },
    ],
  },
};

export default nextConfig;
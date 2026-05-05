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
            value: `
              default-src 'self';
              connect-src 'self' 
                https://api.geoapify.com 
                http://localhost:5000 
                https://*.vercel.app 
                ws://localhost:5000 
                wss://*.vercel.app;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;

              font-src 'self' https: data:;
            `.replace(/\s+/g, ' ').trim()
          },
        ]
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
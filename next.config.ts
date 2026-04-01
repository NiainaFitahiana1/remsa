/** @type {import('next').NextConfig} */
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
        source: '/api/auth/:path*',
        destination: 'https://qr-valid.onrender.com/auth/:path*',
      },
      {
        source: '/api/deliveries/:path*',
        destination: 'https://qr-valid.onrender.com/deliveries/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'https://qr-valid.onrender.com/users/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/proxy/:path*',
      },
    ];
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        'remsa.vercel.app',
      ],
    },
  },

  allowedDevOrigins: [
    '192.168.8.108:3000',
    '192.168.8.108',
  ],
};

export default nextConfig;
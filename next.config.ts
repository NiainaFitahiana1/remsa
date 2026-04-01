/** @type {import('next').NextConfig} */
const nextConfig = {
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
        'localhost:3000',
        '127.0.0.1:3000',
        '192.168.8.108:3000',
        '192.168.8.108',         
        '*.192.168.8.108',       
      ],
    },
  },

  allowedDevOrigins: [
    '192.168.8.108:3000',
    '192.168.8.108',
  ],
};

export default nextConfig;
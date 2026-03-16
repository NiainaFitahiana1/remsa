/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5000/auth/:path*',   
      },
      {
        source: '/api/deliveries/:path*',
        destination: 'http://localhost:5000/deliveries/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:5000/users/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/proxy/:path*',
      },
    ];
  },
};

export default nextConfig;
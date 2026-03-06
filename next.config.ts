/** @type {import('next').NextConfig} */
const nextConfig = {
  // Si tu as cette option, garde-la ou supprime-la si elle cause des soucis
  // allowedDevOrigins: [...],

  async rewrites() {
    return [
      // Règle 1 : protège explicitement les routes auth (si tu en as)
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },

      // Règle 2 : TOUT ce qui commence par /api/ et qui n'est pas auth → proxy
      // Cette règle DOIT être la DERNIÈRE
      {
        source: '/api/:path*',
        destination: '/api/proxy/:path*',
      },
    ];
  },
};

export default nextConfig;
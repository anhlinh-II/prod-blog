/** @type {import('next').NextConfig} */
const nextConfig = {
     allowedDevOrigins: ['172.27.16.1'],
     images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            pathname: '/uploads/**',
          },
          {
            protocol: 'http',
            hostname: 'backend',
            port: '8080',
            pathname: '/uploads/**',
          },
        ],
        minimumCacheTTL: 86400,
      },
   };
   
   export default nextConfig;
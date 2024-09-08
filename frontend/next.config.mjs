/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      { source: '/api/register', destination: 'http://localhost:5000/register' },
      { source: '/api/login', destination: 'http://localhost:5000/login' },
    ];
  },  
};

export default nextConfig;

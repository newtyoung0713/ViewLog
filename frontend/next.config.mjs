/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // User registration and login routes
      { source: '/api/register', destination: 'http://localhost:5000/register' },
      { source: '/api/login', destination: 'http://localhost:5000/login' },
      
      // For creating a new record (POST request)
      { source: '/api/records/new', destination: 'http://localhost:5000/newRecord' },
      
      // For getting all records (GET request)
      { source: '/api/records', destination: 'http://localhost:5000/records' },

      // For handling a specific record by ID (GET, PUT, DELETE requests)
      { source: '/api/records/:id', destination: 'http://localhost:5000/records/:id' }
    ];
  },  
};

export default nextConfig;

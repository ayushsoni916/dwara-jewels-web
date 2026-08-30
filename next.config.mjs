/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // This allows all paths from Cloudinary
      },
      // You can add other external domains here if needed in the future
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;

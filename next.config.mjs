/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.spotifycdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

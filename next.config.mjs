/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 6000,
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
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

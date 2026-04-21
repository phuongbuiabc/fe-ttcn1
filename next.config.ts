import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disabling strict mode in dev can sometimes reduce double-renders and lag
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow access to remote image placeholder.
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // Basic optimization for dev performance
    if (dev) {
      // config.devtool = 'eval-source-map'; // Faster source maps
    }

    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /node_modules/,
      };
    }
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

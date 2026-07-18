let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for CMS pages (can be toggled)
  // output: 'export',
  // trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // For static export, you might need to configure this
    // unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // /sharing/<file> serves files straight from the Vercel Blob store (alen-is-blob)
  // while keeping the URL on this domain. Proxied by Vercel's routing layer — no function runs.
  async rewrites() {
    return [
      {
        source: '/sharing/:path+',
        destination: 'https://r8h8rkqgn3wryrnj.public.blob.vercel-storage.com/:path+',
      },
    ]
  },
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig

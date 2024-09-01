/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ]
  },
  experimental: {
    staleTimes: {
      dynamic: 30
    }
  },
  rewrites: () => {
    return [
      {
        source: '/hashtag/:tag',
        destination: '/search?q=%23:tag'
      }
    ]
  },
};

export default nextConfig;

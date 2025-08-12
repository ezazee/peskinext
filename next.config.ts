/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p16-images-comn-sg.tokopedia-static.net',
      },
      {
        protocol: 'https',
        hostname: 'peskinpro.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
    mdxRs: true,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: [
    '@littlespring/ui',
    '@littlespring/core',
    '@littlespring/legal',
    '@littlespring/suppliers',
    '@littlespring/payments',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default withMDX(nextConfig);


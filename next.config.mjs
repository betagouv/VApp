import { withSentryConfig } from '@sentry/nextjs';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import ContentSecurityPolicy from './csp.config.mjs';

import pkg from './package.json' with { type: 'json' };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: []
  }
});

const version = pkg.version;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff2|webmanifest)$/,
      type: 'asset/resource'
    });

    return config;
  },
  experimental: {
    typedRoutes: true
  },
  sentry: {
    //disableClientWebpackPlugin: true,
    //disableServerWebpackPlugin: true,
    hideSourceMaps: process.env.NODE_ENV === 'production'
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_VERSION_COMMIT: process.env.GITHUB_SHA,
    CONTENT_SECURITY_POLICY: ContentSecurityPolicy
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['@codegouvfr/react-dsfr', 'tss-react']
};

const sentryConfig = {
  silent: true,
  hideSourceMaps: process.env.NODE_ENV === 'production'
};

export default {
  ...withMDX(withSentryConfig(nextConfig, sentryConfig))
};

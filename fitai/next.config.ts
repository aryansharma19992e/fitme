import type { NextConfig } from 'next';
// @ts-ignore — next-pwa 5.x ships CommonJS, no official TS types
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disable in dev — avoids Turbopack/webpack conflicts and keeps HMR clean
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-shell',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // next-pwa injects webpack config; tell Next.js to use webpack (not Turbopack) in all envs
  // so the plugin works without errors. Switch to Turbopack once next-pwa adds support.
  turbopack: {},
  // Silence the workspace-root detection warning caused by multiple package-lock files
  // on this machine. Has no effect on the build output.
  experimental: {},
};

module.exports = withPWA(nextConfig);

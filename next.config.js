/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  images: {
    domains: ['avatar.vercel.sh'],
  },
}

module.exports = withNextIntl(nextConfig);

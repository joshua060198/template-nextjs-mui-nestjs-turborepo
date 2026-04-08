//@ts-check

import next_intl from "next-intl/plugin";

const withNextIntl = next_intl("./app/i18n/request.ts");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  compiler: {
    emotion: true,
  },
  reactStrictMode: true,
  reactCompiler: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  allowedDevOrigins: ["localhost"],
};

export default withNextIntl(nextConfig);

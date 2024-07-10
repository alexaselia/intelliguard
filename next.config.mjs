/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: 'svg-inline-loader',
          options: { removeSVGTagAttrs: false }, // Keeps attributes for GSAP manipulation
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

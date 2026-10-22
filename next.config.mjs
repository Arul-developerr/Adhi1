/** @type {import('next').NextConfig} */
const nextConfig = {
    // An isolated output directory lets CI verify a build while a local dev
    // server is using the default .next directory.
    ...(process.env.TNL_BUILD_DIR ? { distDir: process.env.TNL_BUILD_DIR } : {}),
};

export default nextConfig;

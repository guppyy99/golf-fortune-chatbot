/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
  },
  // 빌드 최적화
  swcMinify: true,
  // Vercel 배포를 위한 설정
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig

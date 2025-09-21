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
  // 정적 내보내기 비활성화 (Vercel에서는 필요없음)
  output: undefined,
  trailingSlash: false,
  // 빌드 최적화
  compress: true,
  poweredByHeader: false,
}

export default nextConfig

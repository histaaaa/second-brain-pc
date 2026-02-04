/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 基础配置
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  
  // 确保静态资源正确处理
  assetPrefix: undefined,
  
  // 开启必要的实验性功能
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

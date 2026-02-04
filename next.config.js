/** @type {import('next').NextConfig} */
const nextConfig = {
  // 改为静态导出模式（不需要服务器）
  output: 'export',
  images: {
    unoptimized: true,
  },
  
  // 确保静态资源正确处理
  assetPrefix: undefined,
}

module.exports = nextConfig

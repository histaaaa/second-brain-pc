# 第二大脑 · Nebula (PC Web 版)

AI 穿戴设备的「第二大脑」—— 星云与抽取。  
所有记忆与资产在 3D 星云中按语义聚类，点击项目后相关点抽离为横向时间线。

## 技术栈

- **框架:** Next.js 14 (App Router), TypeScript
- **3D:** React Three Fiber, Drei
- **样式:** Tailwind CSS（深空黑 + 7 大分类色板）

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)，建议分辨率 1920×1080。

## 功能概览

- **星云视图:** 7 大分类锚点（成长 / 家庭 / 事业 / 休闲 / 社交 / 健康 / 财富）+ 约 1000 个星尘/结晶粒子
- **项目堆栈:** 左侧项目按钮，点击后该项目的点汇聚为前景时间线
- **Spotlight 搜索:** 底部居中搜索栏，过滤星云中的点
- **RESET:** 清空项目选中与搜索，恢复默认星云

## 项目结构

```
src/
├── app/           # 入口与布局
├── components/
│   └── NebulaView # 星空视图、场景、粒子、时间线、搜索栏
└── lib/           # Mock 数据、分类色板
```

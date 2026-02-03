import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "第二大脑 · Nebula",
  description: "AI 穿戴设备第二大脑 PC 版 - 星云与抽取",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased min-h-screen bg-void text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}

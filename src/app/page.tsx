"use client";

import dynamic from "next/dynamic";

const NebulaView = dynamic(() => import("@/components/NebulaView"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-void">
      <span className="text-white/60 animate-pulse">加载星云...</span>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <NebulaView />
    </main>
  );
}

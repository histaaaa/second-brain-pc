"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AIWorkbench = dynamic(
  () => import("@/components/AIWorkbench"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-void">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">加载 AI 工作台...</p>
        </div>
      </div>
    ),
  }
);

export default function AIWorkbenchPage() {
  const searchParams = useSearchParams();
  const [initialQuery, setInitialQuery] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setInitialQuery(decodeURIComponent(query));
    }
    // 短暂延迟以确保组件完全加载
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-void">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">加载 AI 工作台...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <AIWorkbench initialQuery={initialQuery} />
    </main>
  );
}

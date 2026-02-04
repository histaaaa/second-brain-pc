"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

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

function SearchParamsHandler({ onReady }: { onReady: () => void }) {
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    // This component only runs on client, so we can use window.location
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");
    if (query) {
      setInitialQuery(decodeURIComponent(query));
    }
    // Brief delay to ensure component is fully loaded
    const timer = setTimeout(() => onReady(), 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  return <AIWorkbench initialQuery={initialQuery} />;
}

function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-void">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">加载 AI 工作台...</p>
      </div>
    </div>
  );
}

export default function AIWorkbenchPage() {
  const [isReady, setIsReady] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <SearchParamsHandler onReady={() => setIsReady(true)} />
      </Suspense>
    </main>
  );
}

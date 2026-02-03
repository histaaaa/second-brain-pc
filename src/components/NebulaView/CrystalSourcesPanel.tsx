"use client";

import { useEffect, useState } from "react";
import type { StardustRecord } from "@/lib/db/types";

interface CrystalSourcesPanelProps {
  crystalId: string;
  onClose: () => void;
  getCrystalSources: (crystalId: string) => Promise<StardustRecord[]>;
}

export function CrystalSourcesPanel({
  crystalId,
  onClose,
  getCrystalSources,
}: CrystalSourcesPanelProps) {
  const [sources, setSources] = useState<StardustRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCrystalSources(crystalId).then((list) => {
      if (!cancelled) {
        setSources(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [crystalId, getCrystalSources]);

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-80 max-h-[70vh] flex flex-col glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <span className="text-white/80 text-sm font-medium">来源星尘</span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white text-sm"
        >
          关闭
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <span className="text-white/50 text-sm">加载中...</span>
        ) : sources.length === 0 ? (
          <span className="text-white/50 text-sm">无来源记录</span>
        ) : (
          sources.map((s) => (
            <div
              key={s.id}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-left"
            >
              <div className="text-white/90 text-xs font-medium truncate">
                {s.title ?? s.content.slice(0, 30)}
              </div>
              <div className="text-white/50 text-[11px] mt-0.5 line-clamp-2">
                {s.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

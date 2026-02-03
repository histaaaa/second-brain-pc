"use client";

import { useMemo } from "react";
import type { NebulaPoint } from "@/lib/db/local-data";
import { getPointColor } from "@/lib/categories";

interface TimelinePanelProps {
  projectName: string;
  points: NebulaPoint[];
  onClose: () => void;
  onSelectPoint: (point: NebulaPoint) => void;
}

export function TimelinePanel({
  projectName,
  points,
  onClose,
  onSelectPoint,
}: TimelinePanelProps) {
  // 按日期分组
  const groupedPoints = useMemo(() => {
    const groups: Record<string, NebulaPoint[]> = {};
    
    points.forEach((point) => {
      const date = new Date(point.timestamp);
      const key = date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(point);
    });
    
    return Object.entries(groups).sort(([a], [b]) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [points]);

  // 计算时间跨度
  const timeSpan = useMemo(() => {
    if (points.length === 0) return "";
    const dates = points.map((p) => new Date(p.timestamp).getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const days = Math.ceil((max - min) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }, [points]);

  return (
    <div className="absolute right-20 top-6 bottom-6 w-72 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-xl z-40 flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <div>
          <h3 className="text-xs font-bold text-white/80">{projectName}</h3>
          <p className="text-[9px] text-gray-500 mt-0.5">
            {points.length} · {timeSpan}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-gray-500 text-xs">
            close
          </span>
        </button>
      </div>
      
      {/* 时间线内容 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {groupedPoints.map(([date, datePoints]) => (
          <div key={date} className="relative">
            {/* 日期标题 */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[9px] text-gray-500">{date}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            
            {/* 当天的点 */}
            <div className="ml-4 space-y-1.5 border-l border-white/5 pl-3">
              {datePoints
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((point) => {
                  const color = getPointColor(point.category);
                  return (
                    <button
                      key={point.id}
                      onClick={() => onSelectPoint(point)}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="w-0.5 h-5 rounded-full mt-0.5 flex-shrink-0 opacity-60"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-white/80 truncate group-hover:text-white transition-colors">
                            {point.title || point.content}
                          </p>
                          {point.title && point.content && (
                            <p className="text-[9px] text-gray-600 truncate mt-0.5">
                              {point.content}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1">
                            <span 
                              className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-gray-500"
                              style={{ borderLeft: `1.5px solid ${color}` }}
                            >
                              {point.category}
                            </span>
                            <span className="text-[8px] text-gray-600">
                              {new Date(point.timestamp).toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

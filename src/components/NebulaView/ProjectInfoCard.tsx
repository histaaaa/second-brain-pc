"use client";

import { useState, useEffect } from "react";

interface Decision {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: "high" | "medium" | "low";
}

interface ProjectInfoCardProps {
  projectName: string;
  projectDescription?: string;
  decisions: Decision[];
  onDecisionClick?: (decision: Decision) => void;
  onClose?: () => void;
}

const impactColors = {
  high: "border-l-red-400 bg-red-400/5",
  medium: "border-l-yellow-400 bg-yellow-400/5",
  low: "border-l-green-400 bg-green-400/5",
};

const impactLabels = {
  high: "高影响",
  medium: "中影响",
  low: "低影响",
};

export function ProjectInfoCard({
  projectName,
  projectDescription,
  decisions,
  onDecisionClick,
  onClose,
}: ProjectInfoCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 淡入动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // 300ms 延迟后开始淡入

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        absolute left-1/2 top-[20%] -translate-x-1/2 w-80 
        bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl z-30 overflow-hidden
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      {/* 头部 */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">{projectName}</h2>
            {projectDescription && (
              <p className="text-xs text-gray-400 leading-relaxed">
                {projectDescription}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors ml-2"
            >
              <span className="material-symbols-outlined text-gray-500 text-sm">
                close
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 关键决策列表 */}
      <div className="p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          关键决策
        </h3>
        
        <div className="space-y-2">
          {decisions.map((decision, index) => (
            <div
              key={decision.id}
              onClick={() => onDecisionClick?.(decision)}
              className={`
                relative pl-3 py-2 pr-2 rounded-lg cursor-pointer
                transition-all duration-200 hover:scale-[1.02]
                ${impactColors[decision.impact]}
              `}
            >
              {/* 左侧指示条 */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg" />

              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-gray-500">
                      {index + 1}.
                    </span>
                    <span className="text-xs font-medium text-white truncate">
                      {decision.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-2">
                    {decision.description}
                  </p>
                </div>

                <span className={`
                  text-[9px] px-1.5 py-0.5 rounded
                  ${decision.impact === "high" ? "bg-red-400/20 text-red-300" : ""}
                  ${decision.impact === "medium" ? "bg-yellow-400/20 text-yellow-300" : ""}
                  ${decision.impact === "low" ? "bg-green-400/20 text-green-300" : ""}
                `}>
                  {impactLabels[decision.impact]}
                </span>
              </div>

              <div className="mt-1 text-[9px] text-gray-600">
                {decision.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部进度指示 */}
      <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>进度追踪</span>
          <span>{decisions.length} 个关键节点</span>
        </div>
      </div>
    </div>
  );
}

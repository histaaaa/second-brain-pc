"use client";

import { useState, useEffect, useCallback } from "react";

interface SearchResultPanelProps {
  searchStage: "searching" | "reasoning" | "complete";
  aiReasoning: string[];
  finalDocument: string;
  show: boolean;
  onClose: () => void;
  onAddToKnowledge: () => void;
}

export function SearchResultPanel({
  searchStage,
  aiReasoning,
  finalDocument,
  show,
  onClose,
  onAddToKnowledge,
}: SearchResultPanelProps) {
  const [offset, setOffset] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(300);

  // 显示/隐藏动画
  useEffect(() => {
    if (show) {
      const startOffset = 100;
      const endOffset = 0;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentOffset = startOffset + (endOffset - startOffset) * eased;
        setOffset(currentOffset);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      const startOffset = 0;
      const endOffset = 100;
      const duration = 300;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOffset = startOffset + (endOffset - startOffset) * progress;
        setOffset(currentOffset);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [show]);

  // 展开/收起
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setHeight(isExpanded ? 300 : 500);
  };

  // 按 ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 遮罩层 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* 面板容器 - 从底部滑入 */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${offset}%)` }}
      >
        <div
          className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl pointer-events-auto"
          style={{ height: `${height}px`, maxHeight: isExpanded ? "70vh" : "300px" }}
        >
          {/* 拖拽手柄 / 展开按钮 */}
          <div
            onClick={toggleExpand}
            className="h-8 flex items-center justify-center cursor-pointer hover:bg-gray-800/30 transition-colors border-b border-gray-800/30"
          >
            <div className="w-20 h-1.5 bg-gray-600 rounded-full" />
          </div>

          <div className="h-[calc(100%-32px)] overflow-y-auto">
            <div className="p-6">
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">搜索结果</h2>
                <div className="flex items-center gap-3">
                  {searchStage === "complete" ? (
                    <span className="text-sm text-green-400">完成</span>
                  ) : searchStage === "reasoning" ? (
                    <span className="text-sm text-yellow-400 animate-pulse">生成中...</span>
                  ) : (
                    <span className="text-sm text-blue-400 animate-pulse">分析中...</span>
                  )}
                  <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="关闭 (ESC)">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <div className="space-y-4">
                {aiReasoning.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">推理过程</h3>
                    <ul className="space-y-2">
                      {aiReasoning.map((reasoning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
                          {reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {finalDocument && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">生成文档</h3>
                    <div className="prose prose-invert prose-sm max-w-none">
                      {finalDocument.split("\n").map((line, idx) => (
                        <p key={idx} className="text-gray-300 mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {searchStage === "complete" && (
                  <div className="flex gap-3 pt-2">
                    <button onClick={onAddToKnowledge} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      添加到知识库
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">返回星云</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

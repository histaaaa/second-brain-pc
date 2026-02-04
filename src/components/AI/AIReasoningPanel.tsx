"use client";

import { useEffect, useState } from "react";

interface ReasoningStep {
  id: string;
  text: string;
  status: "pending" | "loading" | "completed";
}

interface AIReasoningPanelProps {
  steps: string[];
  isComplete?: boolean;
}

export function AIReasoningPanel({ steps, isComplete = false }: AIReasoningPanelProps) {
  const [animatedSteps, setAnimatedSteps] = useState<ReasoningStep[]>([]);

  // 将字符串步骤转换为带状态的推理步骤
  useEffect(() => {
    const newSteps = steps.map((text, index) => ({
      id: `step-${index}`,
      text,
      status: index < steps.length - 1 ? "completed" : (isComplete ? "completed" : "loading") as "loading"
    }));
    setAnimatedSteps(newSteps);
  }, [steps, isComplete]);

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        AI 推理过程将在这里显示...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium">AI 推理过程</h3>
          <p className="text-xs text-gray-500">思考步骤 · 实时更新</p>
        </div>
      </div>

      {/* 推理步骤列表 */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {animatedSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`
              p-3 rounded-lg border transition-all duration-500
              ${step.status === "completed" 
                ? "bg-green-500/10 border-green-500/30" 
                : step.status === "loading"
                  ? "bg-blue-500/10 border-blue-500/30 animate-pulse"
                  : "bg-gray-800/50 border-gray-700/50"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* 状态图标 */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${step.status === "completed" 
                  ? "bg-green-500/20 text-green-400" 
                  : step.status === "loading"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-700 text-gray-500"
                }
              `}>
                {step.status === "completed" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.status === "loading" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              {/* 步骤内容 */}
              <div className="flex-1">
                <p className={`
                  text-sm leading-relaxed
                  ${step.status === "completed" 
                    ? "text-gray-300" 
                    : step.status === "loading"
                      ? "text-blue-300"
                      : "text-gray-500"
                  }
                `}>
                  {step.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* 正在思考的提示 */}
        {isComplete && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-purple-300">推理完成，正在生成文档...</span>
          </div>
        )}
      </div>

      {/* 底部状态 */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>共 {steps.length} 个推理步骤</span>
          <span className={`flex items-center gap-1 ${isComplete ? "text-green-400" : "text-blue-400"}`}>
            <span className={`w-2 h-2 rounded-full ${isComplete ? "bg-green-400" : "bg-blue-400 animate-pulse"}`} />
            {isComplete ? "推理完成" : "正在推理..."}
          </span>
        </div>
      </div>
    </div>
  );
}

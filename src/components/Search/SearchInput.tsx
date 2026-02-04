"use client";

import { useState, useRef, useEffect } from "react";

interface SearchInputProps {
  onNavigateToWorkbench: (query: string) => void;
  disabled?: boolean;
  progress?: number;
}

export function SearchInput({ onNavigateToWorkbench, disabled, progress = 0 }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 处理点击发送
  const handleSubmit = () => {
    if (query.trim() && !disabled) {
      onNavigateToWorkbench(query.trim());
    }
  };

  // 处理键盘事件（仅用于快捷键，不发送）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  // 自动聚焦
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="relative">
      <div
        className={`
          flex items-center gap-3 px-6 py-4 rounded-full
          bg-gray-800/90 backdrop-blur-md
          border-2 transition-all duration-300
          ${isFocused 
            ? "border-blue-500/50 shadow-lg shadow-blue-500/20 w-[500px]" 
            : "border-gray-700/50 hover:border-gray-600/50 w-96"
          }
        `}
      >
        {/* 搜索图标 */}
        <svg 
          className={`w-5 h-5 ${disabled ? "text-gray-500" : "text-blue-400"}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "AI 思考中..." : "输入问题，探索你的知识星云..."}
          disabled={disabled}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
        />

        {/* 进度条（搜索时显示） */}
        {disabled && progress > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-blue-400">{Math.round(progress)}%</span>
          </div>
        )}

        {/* 加载动画 */}
        {disabled && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* 发送按钮 */}
        {!disabled && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!query.trim()}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 flex items-center gap-2
              ${query.trim() 
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer" 
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            <span>发送</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        )}
      </div>

      {/* 底部提示 */}
      <div className={`
        absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500
        transition-opacity duration-300
        ${isFocused ? "opacity-100" : "opacity-60"}
      `}>
        点击按钮发送问题，开启 AI 思考之旅
      </div>
    </div>
  );
}

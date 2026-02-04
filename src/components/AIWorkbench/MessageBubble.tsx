"use client";

import { useState, useCallback } from "react";
import { ConversationMessage } from "./hooks/useConversation";

interface MessageBubbleProps {
  message: ConversationMessage;
  onExtractCard?: (messageId: string, content: string) => void;
  onRegenerate?: () => void;
}

export function MessageBubble({
  message,
  onExtractCard,
  onRegenerate,
}: MessageBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
  }, [message.content]);

  const handleExtractCard = useCallback(() => {
    if (onExtractCard) {
      onExtractCard(message.id, message.content);
    }
  }, [message.id, message.content, onExtractCard]);

  const renderContent = () => {
    // 简单的Markdown渲染
    const lines = message.content.split("\n");

    return lines.map((line, index) => {
      // 标题
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-xl font-bold text-white mb-2">
            {line.replace("# ", "")}
          </h1>
        );
      }

      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-semibold text-white mb-2 mt-4">
            {line.replace("## ", "")}
          </h2>
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-base font-medium text-white mb-2 mt-3">
            {line.replace("### ", "")}
          </h3>
        );
      }

      // 列表
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="ml-4 text-gray-300">
            {line.replace(/^[-*] /, "")}
          </li>
        );
      }

      // 编号列表
      if (/^\d+\. /.test(line)) {
        return (
          <li key={index} className="ml-4 text-gray-300 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }

      // 粗体
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, "$1");

      // 段落
      if (line.trim()) {
        return (
          <p key={index} className="text-gray-300 mb-2">
            {boldLine}
          </p>
        );
      }

      return null;
    });
  };

  if (message.role === "user") {
    return (
      <div className="flex gap-3 mb-4">
        {/* 用户头像 */}
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          U
        </div>

        {/* 消息内容 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium text-sm">你</span>
            <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
          </div>

          <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // AI 消息
  return (
    <div className="flex gap-3 mb-4">
      {/* AI 头像 */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      {/* 消息内容 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-400 font-medium text-sm">AI 助手</span>
          {message.stage && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {message.stage}
            </span>
          )}
          <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
        </div>

        <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm px-4 py-3 relative">
          {/* 消息内容 */}
          <div className="prose prose-invert prose-sm max-w-none">
            {renderContent()}
          </div>

          {/* 流式动画指示器 */}
          {message.isStreaming && (
            <div className="absolute bottom-2 right-4">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          )}

          {/* 操作按钮 */}
          {!message.isStreaming && (
            <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* 提取卡片按钮 */}
              {onExtractCard && (
                <button
                  onClick={handleExtractCard}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="提取为卡片"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </button>
              )}

              {/* 重新生成按钮 */}
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="重新生成"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}

              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="复制内容"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

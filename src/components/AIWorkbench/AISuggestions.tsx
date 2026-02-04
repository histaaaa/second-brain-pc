"use client";

import { useState, useCallback, useEffect } from "react";

interface AISuggestionsProps {
  messages: { role: string; content: string }[];
  onGenerateDocument?: () => void;
  onStartReview?: () => void;
  onContinueTopic?: (topic: string) => void;
  onIgnore?: () => void;
}

export function AISuggestions({
  messages,
  onGenerateDocument,
  onStartReview,
  onContinueTopic,
  onIgnore,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<
    { id: string; type: string; message: string; actions: { label: string; handler: () => void }[] }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);

  // 检测对话是否接近尾声
  const detectEndingSignals = useCallback((text: string): boolean => {
    const signals = ["总结一下", "就这些", "好了", "暂时这样", "我明白了", "可以了", "够了", "差不多"];
    return signals.some((signal) => text.toLowerCase().includes(signal.toLowerCase()));
  }, []);

  // 检测主题转换
  const detectTopicChange = useCallback((msgs: { role: string; content: string }[]): string | null => {
    if (msgs.length < 4) return null;

    const lastFew = msgs.slice(-4);
    const topics = lastFew.map((m) => m.content.slice(0, 50));

    // 简单的主题检测
    if (topics.length >= 2) {
      const current = topics[topics.length - 1];
      const previous = topics[topics.length - 2];

      // 如果两句话开头不同，可能发生了主题转换
      const currentStart = current.split("，")[0];
      const previousStart = previous.split("，")[0];

      if (currentStart !== previousStart && Math.random() > 0.7) {
        return currentStart;
      }
    }

    return null;
  }, []);

  // 生成建议
  const generateSuggestions = useCallback(() => {
    const newSuggestions: typeof suggestions = [];

    // 检测是否接近对话结束
    if (messages.length > 3) {
      const lastMessage = messages[messages.length - 1]?.content || "";
      if (detectEndingSignals(lastMessage)) {
        newSuggestions.push({
          id: `ending-${Date.now()}`,
          type: "ending",
          message: "检测到您可能想结束对话",
          actions: [
            {
              label: "生成文档",
              handler: () => {
                onGenerateDocument?.();
                setIsVisible(false);
              },
            },
            {
              label: "复盘总结",
              handler: () => {
                onStartReview?.();
                setIsVisible(false);
              },
            },
            {
              label: "继续聊",
              handler: () => setIsVisible(false),
            },
          ],
        });
      }
    }

    // 检测主题转换
    const topicChange = detectTopicChange(messages);
    if (topicChange) {
      newSuggestions.push({
        id: `topic-${Date.now()}`,
        type: "topic",
        message: `发现新话题："${topicChange}"`,
        actions: [
          {
            label: "深入讨论",
            handler: () => {
              onContinueTopic?.(topicChange);
              setIsVisible(false);
            },
          },
          {
            label: "记录为新阶段",
            handler: () => setIsVisible(false),
          },
          {
            label: "忽略",
            handler: () => setIsVisible(false),
          },
        ],
      });
    }

    // 检测对话深度
    if (messages.length > 6 && messages.length % 3 === 0) {
      newSuggestions.push({
        id: `depth-${Date.now()}`,
        type: "depth",
        message: "讨论已经比较深入了，是否需要记录关键点？",
        actions: [
          {
            label: "提取摘要",
            handler: () => setIsVisible(false),
          },
          {
            label: "继续深入",
            handler: () => setIsVisible(false),
          },
        ],
      });
    }

    setSuggestions(newSuggestions);
    setIsVisible(newSuggestions.length > 0);
  }, [messages, detectEndingSignals, detectTopicChange, onGenerateDocument, onStartReview, onContinueTopic]);

  // 监听消息变化
  useEffect(() => {
    generateSuggestions();
  }, [messages.length]);

  // 忽略建议
  const handleIgnore = useCallback(() => {
    setIsVisible(false);
    onIgnore?.();
  }, [onIgnore]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-8 w-80 z-50">
      {/* 建议卡片 */}
      {suggestions.slice(0, 2).map((suggestion) => (
        <div
          key={suggestion.id}
          className="mb-2 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
        >
          {/* 头部 */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-white font-medium text-sm">AI 建议</span>
          </div>

          {/* 内容 */}
          <div className="p-4">
            <p className="text-gray-300 text-sm mb-3">{suggestion.message}</p>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2">
              {suggestion.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.handler}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition-colors
                    $index === 0
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 关闭按钮 */}
      <button
        onClick={handleIgnore}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { useAICards, AICardData } from "./hooks/useAICards";
import { AICard } from "./AICard";

interface CardCollectorProps {
  messages: { id: string; content: string }[];
  onCardCreated?: (card: AICardData) => void;
}

export function CardCollector({ messages, onCardCreated }: CardCollectorProps) {
  const {
    cards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    selectedCards,
    toggleSelectCard,
    clearSelection,
  } = useAICards();

  // 从消息中提取卡片
  const extractCardFromMessage = useCallback(
    (messageId: string, content: string) => {
      // 简单的智能提取逻辑
      const lines = content.split("\n");
      let title = "新卡片";
      let summary = content.slice(0, 100);

      // 尝试从第一行提取标题
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
          title = trimmed.slice(0, 30);
          if (trimmed.length > 30) title += "...";
          break;
        }
      }

      // 生成摘要
      summary = content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/[-*]\s/g, "")
        .slice(0, 150);

      const cardId = addCard({
        title,
        summary,
        content,
        sourceMessageId: messageId,
        sourceConversationId: "current",
        tags: ["AI生成"],
        position: { x: 0, y: 0 },
      });

      // 查找创建的卡片
      const newCard = cards.find((c) => c.id === cardId);
      if (newCard && onCardCreated) {
        onCardCreated(newCard);
      }

      return cardId;
    },
    [addCard, cards, onCardCreated]
  );

  // 批量提取所有消息中的关键信息
  const batchExtract = useCallback(() => {
    messages.forEach((msg) => {
      if (!cards.some((c) => c.sourceMessageId === msg.id)) {
        extractCardFromMessage(msg.id, msg.content);
      }
    });
  }, [messages, cards, extractCardFromMessage]);

  // 处理卡片拖拽
  const handleDragStart = useCallback(
    (e: React.DragEvent, card: AICardData) => {
      e.dataTransfer.setData("card", JSON.stringify(card));
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  // 处理卡片删除
  const handleDelete = useCallback(
    (id: string) => {
      deleteCard(id);
    },
    [deleteCard]
  );

  // 处理卡片编辑
  const handleEdit = useCallback(
    (id: string, updates: Partial<AICardData>) => {
      updateCard(id, updates);
    },
    [updateCard]
  );

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-white font-medium">摘要卡片</h3>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedCards.length > 0 && (
            <>
              <span className="text-gray-400 text-xs">
                已选择 {selectedCards.length} 个
              </span>
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}

          <button
            onClick={batchExtract}
            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded transition-colors"
          >
            批量提取
          </button>
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-sm mb-1">暂无卡片</p>
            <p className="text-gray-600 text-xs">
              点击消息旁的按钮提取内容
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <AICard
              key={card.id}
              card={card}
              isSelected={selectedCards.includes(card.id)}
              onSelect={toggleSelectCard}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>

      {/* 拖拽提示 */}
      {cards.length > 0 && (
        <div className="p-2 border-t border-gray-700/50 bg-gray-800/30">
          <p className="text-gray-500 text-xs text-center">
            拖拽卡片到文档工作台进行整理
          </p>
        </div>
      )}
    </div>
  );
}

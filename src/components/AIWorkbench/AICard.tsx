"use client";

import { useState, useCallback } from "react";
import { AICardData } from "./hooks/useAICards";

interface AICardProps {
  card: AICardData;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, updates: Partial<AICardData>) => void;
  onDragStart?: (e: React.DragEvent, card: AICardData) => void;
}

export function AICard({
  card,
  isSelected = false,
  onSelect,
  onDelete,
  onEdit,
  onDragStart,
}: AICardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editSummary, setEditSummary] = useState(card.summary);

  const handleSave = useCallback(() => {
    if (onEdit) {
      onEdit(card.id, {
        title: editTitle,
        summary: editSummary,
      });
    }
    setIsEditing(false);
  }, [card.id, editTitle, editSummary, onEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        setEditTitle(card.title);
        setEditSummary(card.summary);
        setIsEditing(false);
      }
    },
    [card.title, card.summary, handleSave]
  );

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, card)}
      onClick={() => onSelect && onSelect(card.id)}
      className={`
        relative p-4 rounded-xl border transition-all cursor-pointer group
        ${
          isSelected
            ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5"
            : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70"
        }
      `}
    >
      {/* 头部：标题和操作按钮 */}
      <div className="flex items-start justify-between mb-2">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white font-medium focus:outline-none"
            autoFocus
          />
        ) : (
          <h4 className="text-white font-medium text-sm line-clamp-2">
            {card.title}
          </h4>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-1 hover:bg-gray-700 rounded text-green-400"
              title="保存"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
              title="编辑"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
              title="删除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 摘要内容 */}
      {isEditing ? (
        <textarea
          value={editSummary}
          onChange={(e) => setEditSummary(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-gray-400 text-xs resize-none focus:outline-none"
          rows={3}
        />
      ) : (
        <p className="text-gray-400 text-xs line-clamp-3">{card.summary}</p>
      )}

      {/* 底部：标签和时间 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/30">
        <div className="flex items-center gap-1 flex-wrap">
          {card.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-xs bg-gray-700/50 text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{card.tags.length - 2}</span>
          )}
        </div>

        <span className="text-xs text-gray-500">{formatTime(card.createdAt)}</span>
      </div>

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { NebulaPoint2D } from "./types";

interface CrystalEditorPanelProps {
  point: NebulaPoint2D;
  onClose: () => void;
  onSave: (updates: { title: string; content: string }) => void;
}

export function CrystalEditorPanel({ point, onClose, onSave }: CrystalEditorPanelProps) {
  const [title, setTitle] = useState(point.title || "");
  const [content, setContent] = useState(point.content || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTitle(point.title || "");
    setContent(point.content || "");
  }, [point]);

  const handleSave = () => {
    onSave({ title, content });
    setIsEditing(false);
  };

  const date = new Date(point.timestamp).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="absolute top-4 right-4 z-50 w-96 h-[calc(100%-2rem)] animate-in slide-in-from-right duration-300">
      <div className="glass rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
        {/* 头部 */}
        <div
          className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0"
          style={{ backgroundColor: `${point.color}20` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: point.color, boxShadow: `0 0 15px ${point.color}` }}
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: point.color }}>
              {point.type === "crystal" ? "📄 文档结晶" : "✨ 星尘"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && point.type === "crystal" && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="编辑"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* 来源星尘提示 */}
        {point.type === "crystal" && point.sourceStardustIds && point.sourceStardustIds.length > 0 && (
          <div className="px-6 py-3 bg-white/5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-sm">link</span>
              <span>关联了 <strong className="text-white">{point.sourceStardustIds.length}</strong> 个来源星尘</span>
            </div>
          </div>
        )}

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="输入标题..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                  内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                  placeholder="输入内容..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 px-4 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  保存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 px-4 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                  标题
                </label>
                <h2 className="text-xl text-white font-medium leading-relaxed">
                  {title || "无标题"}
                </h2>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                  内容
                </label>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {content || "暂无内容"}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  <span>创建于 {date}</span>
                </div>
              </div>

              {point.projectIds.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                    所属项目
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {point.projectIds.map((projectId) => (
                      <span
                        key={projectId}
                        className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-gray-300"
                      >
                        {projectId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

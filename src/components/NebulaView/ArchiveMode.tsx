"use client";

import { useState } from "react";
import {
  LayoutGrid,
  FolderOpen,
  Clock,
  CheckCircle2,
  Star,
  Settings,
  ChevronRight,
  FileText,
  User,
  ListTodo,
  Sparkles,
  Mic,
} from "lucide-react";
import type { NebulaPoint } from "@/lib/db/local-data";
import { getCategoryColor } from "@/lib/db/local-data";

// PARA 分类结构
const PARA_CATEGORIES = [
  { id: "projects", name: "Projects", icon: FolderOpen, color: "text-blue-400" },
  { id: "areas", name: "Areas", icon: LayoutGrid, color: "text-green-400" },
  { id: "resources", name: "Resources", icon: FileText, color: "text-yellow-400" },
  { id: "archives", name: "Archives", icon: Clock, color: "text-gray-400" },
];

interface ArchiveModeProps {
  onClose: () => void;
  points: NebulaPoint[];
  projects: { id: string; name: string }[];
}

export function ArchiveMode({ onClose, points, projects }: ArchiveModeProps) {
  const [selectedItem, setSelectedItem] = useState<NebulaPoint | null>(
    points.length > 0 ? points[0] : null
  );
  const [activeSidebar, setActiveSidebar] = useState("projects");

  // 按项目分组
  const pointsByProject = points.reduce((acc, p) => {
    p.projectIds.forEach(pid => {
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(p);
    });
    return acc;
  }, {} as Record<string, NebulaPoint[]>);

  // 获取项目名称
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || projectId;
  };

  // 获取类型图标
  const getTypeIcon = (point: NebulaPoint) => {
    return (
      <div
        className="w-2 h-2 rounded-full mt-2"
        style={{ backgroundColor: getCategoryColor(point.category) }}
      />
    );
  };

  return (
    <div className="absolute inset-0 z-10 flex bg-void">
      {/* 第一栏：侧边栏导航 */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            <span className="font-semibold">第二大脑</span>
          </button>
        </div>

        {/* PARA 导航 */}
        <nav className="flex-1 p-3 space-y-1">
          {PARA_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveSidebar(cat.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${activeSidebar === cat.id
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <cat.icon size={18} className={cat.color} />
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>

        {/* 项目列表 */}
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2 px-2">
            项目
          </div>
          {projects.map((project) => {
            const count = pointsByProject[project.id]?.length || 0;
            return (
              <button
                key={project.id}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <FolderOpen size={16} className="text-blue-400" />
                <span className="flex-1 truncate text-left">{project.name}</span>
                <span className="text-xs text-white/30">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 设置 */}
        <div className="p-3 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Settings size={18} />
            <span>设置</span>
          </button>
        </div>
      </aside>

      {/* 第二栏：列表/卡片流 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部搜索栏 */}
        <div className="h-14 border-b border-white/10 flex items-center px-4 gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索记忆..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <ListTodo size={18} />
          </button>
        </div>

        {/* 列表内容 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {points.map((point) => (
              <button
                key={point.id}
                onClick={() => setSelectedItem(point)}
                className={`
                  w-full flex items-start gap-4 p-4 rounded-lg text-left
                  transition-all duration-150 group
                  ${selectedItem?.id === point.id
                    ? "bg-white/10 border border-white/10"
                    : "hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {/* 来源图标 */}
                <div className="mt-0.5">
                  {point.projectIds.length > 0 ? (
                    <FolderOpen size={16} className="text-blue-400" />
                  ) : (
                    getTypeIcon(point)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: getCategoryColor(point.category) }}
                    >
                      {point.category}
                    </span>
                    {/* 来源标签 */}
                    {point.projectIds.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded">
                        {getProjectName(point.projectIds[0])}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white/90 font-medium mt-1">
                    {point.title || point.content.slice(0, 30)}
                  </h3>
                  <p className="text-white/40 text-sm mt-1 line-clamp-2">
                    {point.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/30 text-xs">
                      {new Date(point.timestamp).toLocaleDateString("zh-CN")}
                    </span>
                    {/* 来源类型 */}
                    <span className="flex items-center gap-1 text-white/20 text-xs">
                      {point.projectIds.length > 0 ? (
                        <>
                          <FolderOpen size={12} />
                          <span>项目关联</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span>独立记忆</span>
                        </>
                      )}
                    </span>
                    {/* 重要性指示 */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={10}
                          className={`
                            ${star <= Math.ceil(point.importance * 5)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white/10"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`
                    text-white/20 mt-2 transition-transform duration-150
                    ${selectedItem?.id === point.id ? "translate-x-0" : "group-hover:translate-x-1"}
                  `}
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 第三栏：详情编辑器 */}
      <aside className="w-96 border-l border-white/10 flex flex-col bg-white/[0.02]">
        {selectedItem ? (
          <>
            {/* 详情头部 */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${getCategoryColor(selectedItem.category)}20`,
                    color: getCategoryColor(selectedItem.category),
                  }}
                >
                  {selectedItem.category}
                </span>
                <span className="text-xs text-white/30">
                  {new Date(selectedItem.timestamp).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white/90">
                {selectedItem.title || "无标题"}
              </h2>
              {/* 项目标签 */}
              {selectedItem.projectIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedItem.projectIds.map((pid) => (
                    <span
                      key={pid}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded"
                    >
                      <FolderOpen size={10} />
                      {getProjectName(pid)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 详情内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-white/40" />
                  <span className="text-xs text-white/40 uppercase tracking-wide">
                    详细内容
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedItem.content}
                </p>
              </div>

              {/* 元信息 */}
              <div className="mb-6 p-3 rounded-lg bg-white/5">
                <div className="text-xs text-white/40 uppercase tracking-wide mb-3">
                  元信息
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">重要性</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={`
                            ${star <= Math.ceil(selectedItem.importance * 5)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white/10"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">类型</span>
                    <span className="text-white/60">星尘</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">来源</span>
                    <span className="text-white/60">项目关联</span>
                  </div>
                </div>
              </div>

              {/* 底部操作按钮 */}
              <div className="space-y-2">
                <button className="w-full py-2.5 px-4 rounded-lg bg-white/10 text-white/80 text-sm font-medium hover:bg-white/15 transition-colors">
                  编辑内容
                </button>
                <button className="w-full py-2.5 px-4 rounded-lg bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                  提炼为结晶
                </button>
                <button className="w-full py-2.5 px-4 rounded-lg text-white/40 text-sm hover:bg-white/5 transition-colors">
                  添加到其他项目
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
            选择一条记忆查看详情
          </div>
        )}
      </aside>
    </div>
  );
}

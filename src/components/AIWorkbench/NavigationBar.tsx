"use client";

import { useState, useCallback } from "react";

interface Project {
  id: string;
  name: string;
  icon?: string;
  updatedAt: Date;
}

interface Session {
  id: string;
  title: string;
  updatedAt: Date;
  preview?: string;
}

interface NavigationBarProps {
  projects: Project[];
  currentProjectId?: string;
  sessions?: Session[];
  onProjectSelect?: (projectId: string) => void;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  onOpenAssetLibrary?: () => void;
}

export function NavigationBar({
  projects,
  currentProjectId,
  sessions = [],
  onProjectSelect,
  onSessionSelect,
  onNewSession,
  onOpenAssetLibrary,
}: NavigationBarProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "history">("projects");
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return d.toLocaleDateString("zh-CN");
  };

  const defaultProjects: Project[] = [
    { id: "default", name: "默认项目", updatedAt: new Date() },
    { id: "product", name: "产品策划", updatedAt: new Date() },
    { id: "tech", name: "技术方案", updatedAt: new Date() },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <div
      className={`
        h-full bg-gray-900/50 border-r border-gray-800 flex flex-col transition-all duration-300
        ${isExpanded ? "w-64" : "w-16"}
      `}
    >
      {/* 收缩按钮 */}
      <div className="p-2 border-b border-gray-800 flex justify-end">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 标签切换 */}
      {isExpanded && (
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("projects")}
            className={`
              flex-1 px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === "projects"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            项目
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`
              flex-1 px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === "history"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            历史
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {isExpanded ? (
          activeTab === "projects" ? (
            /* 项目列表 */
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-gray-500 text-xs font-medium uppercase">
                  项目列表
                </span>
                <button
                  onClick={onNewSession}
                  className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                  title="新建项目"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-1">
                {displayProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect && onProjectSelect(project.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${
                        currentProjectId === project.id
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                        ${
                          currentProjectId === project.id
                            ? "bg-blue-500/20"
                            : "bg-gray-700"
                        }
                      `}
                    >
                      {project.icon || project.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium truncate">
                        {project.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(project.updatedAt)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* 资产库入口 */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-gray-500 text-xs font-medium uppercase">
                    资产库
                  </span>
                </div>

                <button
                  onClick={onOpenAssetLibrary}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <span className="text-sm">个人资产库</span>
                </button>
              </div>
            </div>
          ) : (
            /* 历史会话列表 */
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-gray-500 text-xs font-medium uppercase">
                  最近会话
                </span>
                <button
                  onClick={onNewSession}
                  className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                  title="新建会话"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-1">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 text-sm">暂无历史会话</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => onSessionSelect && onSessionSelect(session.id)}
                      className="w-full flex items-start gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {session.title}
                        </div>
                        {session.preview && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {session.preview}
                          </div>
                        )}
                        <div className="text-xs text-gray-600 mt-1">
                          {formatTime(session.updatedAt)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )
        ) : (
          /* 收缩状态下的图标 */
          <div className="flex flex-col items-center py-4 gap-2">
            <button
              onClick={() => {
                setActiveTab("projects");
                setIsExpanded(true);
              }}
              className={`p-3 rounded-lg transition-colors ${
                activeTab === "projects"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title="项目"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>

            <button
              onClick={() => {
                setActiveTab("history");
                setIsExpanded(true);
              }}
              className={`p-3 rounded-lg transition-colors ${
                activeTab === "history"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title="历史"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <div className="flex-1" />

            <button
              onClick={onOpenAssetLibrary}
              className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="资产库"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 底部用户信息 */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          {isExpanded && (
            <div className="flex-1">
              <div className="text-sm font-medium text-white">用户</div>
              <div className="text-xs text-gray-500">Premium</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

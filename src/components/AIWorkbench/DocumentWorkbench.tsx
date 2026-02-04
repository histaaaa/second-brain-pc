"use client";

import { useState, useCallback, useRef } from "react";
import { AICardData } from "./hooks/useAICards";
import { AICard } from "./AICard";

interface DocumentWorkbenchProps {
  cards: AICardData[];
  onCardDrop?: (card: AICardData) => void;
  onCardUpdate?: (id: string, updates: Partial<AICardData>) => void;
  onCardDelete?: (id: string) => void;
  onExport?: (content: string) => void;
}

export function DocumentWorkbench({
  cards,
  onCardDrop,
  onCardUpdate,
  onCardDelete,
  onExport,
}: DocumentWorkbenchProps) {
  const [documentTitle, setDocumentTitle] = useState("未命名文档");
  const [documentContent, setDocumentContent] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 处理拖拽放置
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      try {
        const data = e.dataTransfer.getData("card");
        if (data) {
          const card = JSON.parse(data) as AICardData;
          onCardDrop?.(card);

          // 将卡片内容追加到文档
          const newContent = documentContent + `\n\n## ${card.title}\n\n${card.content}`;
          setDocumentContent(newContent);
        }
      } catch (error) {
        console.error("Failed to parse dropped card:", error);
      }
    },
    [documentContent, onCardDrop]
  );

  // 处理导出
  const handleExport = useCallback(
    (format: "markdown" | "html" | "pdf") => {
      let content = documentContent;

      if (format === "markdown") {
        content = `# ${documentTitle}\n\n${documentContent}`;
        onExport?.(content);

        // 下载文件
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${documentTitle}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "html") {
        content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${documentTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    h2 { color: #555; margin-top: 30px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${documentTitle}</h1>
  ${documentContent.replace(/\n/g, "<br/>")}
</body>
</html>`;

        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${documentTitle}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [documentTitle, documentContent, onExport]
  );

  // 文档模板
  const templates = [
    { name: "产品定义", icon: "📦", prompt: "## 产品愿景\n\n## 核心功能\n\n## 用户价值\n\n## 差异化定位" },
    { name: "决策分析", icon: "⚖️", prompt: "## 问题背景\n\n## 方案对比\n\n| 维度 | 方案A | 方案B |\n|------|------|------|\n| 成本 | | |\n| 周期 | | |\n| 风险 | | |\n\n## 推荐方案" },
    { name: "复盘报告", icon: "📊", prompt: "## 复盘背景\n\n## 完成事项\n\n## 待解决问题\n\n## 经验总结\n\n## 下一步计划" },
    { name: "会议纪要", icon: "📝", prompt: "## 会议信息\n- 时间：\n- 参与人员：\n\n## 讨论要点\n\n## 决议事项\n\n## 待办事项" },
  ];

  const applyTemplate = (template: (typeof templates)[0]) => {
    setDocumentContent(template.prompt);
    setDocumentTitle(`${documentTitle} - ${template.name}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/30">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none"
            />
            <p className="text-gray-500 text-xs">文档工作台</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("markdown")}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出
          </button>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("editor")}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            ${
              activeTab === "editor"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          编辑器
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            ${
              activeTab === "preview"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          预览
        </button>

        <div className="flex-1" />

        {/* 模板选择 */}
        <div className="flex items-center gap-1 px-2">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
              title={template.name}
            >
              {template.icon}
            </button>
          ))}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：编辑器/预览 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "editor" ? (
            <textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="开始编写文档... 拖拽卡片到此处可快速插入内容"
              className="w-full h-full bg-transparent text-gray-300 p-4 resize-none focus:outline-none"
              style={{
                minHeight: "100%",
              }}
            />
          ) : (
            <div className="p-4 prose prose-invert prose-sm max-w-none">
              {documentContent ? (
                <div className="whitespace-pre-wrap">{documentContent}</div>
              ) : (
                <div className="text-gray-500 text-center py-12">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>暂无内容</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧：拖拽区域 */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-48 border-l border-gray-800 transition-colors
            ${isDragging ? "bg-blue-500/10 border-blue-500/30" : "bg-gray-900/30"}
          `}
        >
          <div className="p-3 border-b border-gray-800">
            <h4 className="text-gray-400 text-xs font-medium uppercase">
              卡片区
            </h4>
          </div>

          <div className="p-2 space-y-2 overflow-y-auto" style={{ height: "calc(100% - 48px)" }}>
            {cards.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-500 text-xs">
                  {isDragging ? "释放以放置" : "拖拽卡片到此"}
                </p>
              </div>
            ) : (
              cards.map((card) => (
                <div key={card.id} draggable>
                  <AICard
                    card={card}
                    onEdit={(id, updates) => onCardUpdate?.(id, updates)}
                    onDelete={(id) => onCardDelete?.(id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-gray-800 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>字数: {documentContent.length}</span>
          <span>卡片: {cards.length}</span>
        </div>

        <div className="flex items-center gap-2">
          {isDragging && (
            <span className="text-blue-400">释放以添加卡片内容</span>
          )}
        </div>
      </div>
    </div>
  );
}

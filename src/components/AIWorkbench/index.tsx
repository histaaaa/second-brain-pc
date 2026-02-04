"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { NavigationBar } from "./NavigationBar";
import { ConversationPanel } from "./ConversationPanel";
import { CardCollector } from "./CardCollector";
import { DocumentWorkbench } from "./DocumentWorkbench";
import { AISuggestions } from "./AISuggestions";
import { useConversation, ConversationMessage } from "./hooks/useConversation";
import { useAICards, AICardData } from "./hooks/useAICards";

// 动态导入星云图组件（避免 SSR 问题）
const NebulaCanvas = dynamic(
  () => import("../NebulaView/NebulaCanvas").then((mod) => mod.NebulaCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-void">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">加载星云图...</p>
        </div>
      </div>
    ),
  }
);

interface AIWorkbenchProps {
  initialQuery?: string;
}

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

export default function AIWorkbench({ initialQuery = "" }: AIWorkbenchProps) {
  // 状态管理
  const [currentProjectId, setCurrentProjectId] = useState<string>("default");
  const [activeSection, setActiveSection] = useState<"conversation" | "nebula">("conversation");
  const [nebulaMode, setNebulaMode] = useState<"full" | "compact">("full");

  // 对话状态
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastResponse,
    clearConversation,
    detectStage,
  } = useConversation(currentProjectId);

  // 卡片状态
  const {
    cards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  } = useAICards();

  // 模拟项目和会话数据
  const [projects] = useState<Project[]>([
    { id: "default", name: "默认项目", updatedAt: new Date() },
    { id: "product", name: "产品策划", updatedAt: new Date() },
    { id: "tech", name: "技术方案", updatedAt: new Date() },
    { id: "marketing", name: "营销策略", updatedAt: new Date() },
  ]);

  const [sessions] = useState<Session[]>([
    {
      id: "1",
      title: "第二大脑产品定义讨论",
      updatedAt: new Date(Date.now() - 3600000),
      preview: "关于产品定位和核心功能的讨论...",
    },
    {
      id: "2",
      title: "用户画像分析",
      updatedAt: new Date(Date.now() - 7200000),
      preview: "目标用户群体的特征和需求...",
    },
    {
      id: "3",
      title: "竞品调研总结",
      updatedAt: new Date(Date.now() - 86400000),
      preview: "主流竞品的功能和定价分析...",
    },
  ]);

  // 星云图数据（使用本地数据）
  const [nebulaPoints, setNebulaPoints] = useState<any[]>([]);
  const [nebulaProjects, setNebulaProjects] = useState<any[]>([]);

  // 加载星云数据
  useEffect(() => {
    const loadNebulaData = async () => {
      try {
        const { loadDatabaseData, stardustsToNebulaPoints, crystalsToNebulaPoints } = await import(
          "@/lib/db/local-data"
        );
        const { projects: projList, stardusts, crystals } = await loadDatabaseData();

        const dustPoints = stardustsToNebulaPoints(stardusts);
        const crystalPoints = crystalsToNebulaPoints(crystals, dustPoints);

        setNebulaPoints([...dustPoints, ...crystalPoints]);
        setNebulaProjects(projList.map((p) => ({ id: p.id, name: p.name })));
      } catch (error) {
        console.error("Failed to load nebula data:", error);
      }
    };

    loadNebulaData();
  }, []);

  // 处理提取卡片
  const handleExtractCard = useCallback(
    (messageId: string, content: string) => {
      // 简单的智能提取
      const lines = content.split("\n");
      let title = "新卡片";
      let summary = content.slice(0, 100);

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
          title = trimmed.slice(0, 30);
          if (trimmed.length > 30) title += "...";
          break;
        }
      }

      summary = content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/[-*]\s/g, "")
        .slice(0, 150);

      addCard({
        title,
        summary,
        content,
        sourceMessageId: messageId,
        sourceConversationId: "current",
        tags: ["AI生成"],
        position: { x: 0, y: 0 },
      });
    },
    [addCard]
  );

  // 处理卡片放置
  const handleCardDrop = useCallback((card: AICardData) => {
    console.log("Card dropped:", card.title);
  }, []);

  // 处理卡片更新
  const handleCardUpdate = useCallback((id: string, updates: any) => {
    updateCard(id, updates);
  }, [updateCard]);

  // 处理卡片删除
  const handleCardDelete = useCallback((id: string) => {
    deleteCard(id);
  }, [deleteCard]);

  // 处理导出
  const handleExport = useCallback((content: string) => {
    console.log("Exporting:", content);
  }, []);

  // 处理项目选择
  const handleProjectSelect = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
    clearConversation();
  }, [clearConversation]);

  // 处理会话选择
  const handleSessionSelect = useCallback((sessionId: string) => {
    console.log("Selected session:", sessionId);
  }, []);

  // 处理新会话
  const handleNewSession = useCallback(() => {
    clearConversation();
  }, [clearConversation]);

  // 处理打开资产库
  const handleOpenAssetLibrary = useCallback(() => {
    console.log("Opening asset library...");
  }, []);

  // 当前阶段
  const currentStage = messages.length > 0
    ? detectStage(messages)
    : "目标设定";

  // 自动发送初始查询
  useEffect(() => {
    if (initialQuery && messages.length === 0 && !isLoading) {
      const timer = setTimeout(() => {
        sendMessage(initialQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, messages.length, isLoading, sendMessage]);

  return (
    <div className="h-screen w-full bg-void flex overflow-hidden">
      {/* 第一栏：导航栏 */}
      <NavigationBar
        projects={projects}
        currentProjectId={currentProjectId}
        sessions={sessions}
        onProjectSelect={handleProjectSelect}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        onOpenAssetLibrary={handleOpenAssetLibrary}
      />

      {/* 第二栏：核心互动区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部：模式切换 */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/30">
          <div className="flex items-center gap-4">
            {/* 模式切换按钮 */}
            <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => {
                  setActiveSection("conversation");
                  setNebulaMode("full");
                }}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors
                  {activeSection === "conversation"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                对话模式
              </button>
              <button
                onClick={() => {
                  setActiveSection("nebula");
                  setNebulaMode("compact");
                }}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors
                  {activeSection === "nebula"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                `}
              >
                星云模式
              </button>
            </div>

            {/* 当前阶段 */}
            {activeSection === "conversation" && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">当前阶段:</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {currentStage}
                </span>
              </div>
            )}
          </div>

          {/* 项目信息 */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">
              {projects.find((p) => p.id === currentProjectId)?.name}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧/中央：对话或星云 */}
          <div className="flex-1 relative">
            {activeSection === "conversation" ? (
              <ConversationPanel
                projectId={currentProjectId}
                onExtractCard={handleExtractCard}
                onStageChange={(stage) => console.log("Stage:", stage)}
              />
            ) : (
              <div className="h-full w-full relative">
                <NebulaCanvas
                  points={nebulaPoints}
                  projectPoints={[]}
                  projects={nebulaProjects}
                  activeProjectId={null}
                  searchQuery=""
                  onSearchChange={() => {}}
                  onSelectProject={() => {}}
                  onSelectPoint={() => {}}
                  compactMode={nebulaMode === "compact"}
                />

                {/* 星云模式下的提示 */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full">
                  <span className="text-white text-sm">
                    星云模式 - 展示知识关联
                  </span>
                </div>
              </div>
            )}

            {/* AI 建议 */}
            <AISuggestions
              messages={messages}
              onGenerateDocument={() => {
                setActiveSection("conversation");
              }}
              onStartReview={() => {
                console.log("Starting review...");
              }}
              onContinueTopic={(topic) => {
                sendMessage(`继续讨论：${topic}`);
              }}
            />
          </div>
        </div>
      </div>

      {/* 第三栏：工作台 */}
      <div className="w-80 border-l border-gray-800 flex flex-col bg-gray-900/50">
        {/* 工作台标签 */}
        <div className="flex border-b border-gray-800">
          <button className="flex-1 px-4 py-3 text-sm font-medium text-white border-b-2 border-blue-500">
            卡片收集
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white">
            文档编辑
          </button>
        </div>

        {/* 卡片收集器 */}
        <div className="flex-1 overflow-hidden">
          <CardCollector
            messages={messages.filter((m) => m.role === "assistant")}
            onCardCreated={(card) => console.log("Card created:", card.title)}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  loadDatabaseData, 
  stardustsToNebulaPoints,
  crystalsToNebulaPoints, 
  filterByProject,
  type NebulaPoint 
} from "@/lib/db/local-data";
import { NebulaCanvas } from "./NebulaCanvas";
import { ProjectStack } from "./ProjectStack";
import { ViewModeToggle } from "./ViewModeToggle";
import { ArchiveMode } from "./ArchiveMode";
import { SearchInput } from "@/components/Search/SearchInput";
import { SearchResultPanel } from "@/components/Search/SearchResultDrawer";
import { AIReasoningPanel } from "@/components/AI/AIReasoningPanel";
import { ProductDocument } from "@/components/Document/ProductDocument";

type ViewMode = "nebula" | "archive" | "search";
type SearchStage = "idle" | "searching" | "reasoning" | "complete";

export default function NebulaView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("nebula");
  const [searchStage, setSearchStage] = useState<SearchStage>("idle");
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [allPoints, setAllPoints] = useState<NebulaPoint[]>([]);
  const [points, setPoints] = useState<NebulaPoint[]>([]);
  const [projectPoints, setProjectPoints] = useState<NebulaPoint[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrystalId, setSelectedCrystalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 搜索相关状态
  const [searchProgress, setSearchProgress] = useState(0);
  const [aiReasoning, setAiReasoning] = useState<string[]>([]);
  const [finalDocument, setFinalDocument] = useState("");
  const [finalSearchTime, setFinalSearchTime] = useState(0); // 搜索完成后的最终时间值
  const [showResultPanel, setShowResultPanel] = useState(false); // 是否显示结果面板
  const [resultPanelOffset, setResultPanelOffset] = useState(100); // 面板偏移量（用于动画）
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 从 database 文件夹加载真实数据
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { projects: projList, stardusts, crystals } = await loadDatabaseData();
        
        if (cancelled) return;
        
        // 转换为 NebulaPoint 格式
        const dustPoints = stardustsToNebulaPoints(stardusts);
        const crystalPoints = crystalsToNebulaPoints(crystals, dustPoints);
        const allNebulaPoints = [...dustPoints, ...crystalPoints];
        
        console.log(`📦 星云数据: ${dustPoints.length} 星尘, ${crystalPoints.length} 结晶`);
        
        setProjects(projList.map(p => ({ id: p.id, name: p.name })));
        setAllPoints(allNebulaPoints);
        setPoints(allNebulaPoints);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load database:", error);
        setLoading(false);
      }
    })();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPoints(allPoints);
      return;
    }
    
    const filtered = allPoints.filter(p => 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPoints(filtered);
  }, [searchQuery, allPoints]);

  // 项目筛选
  useEffect(() => {
    if (!activeProjectId) {
      setProjectPoints([]);
      return;
    }
    
    const filtered = filterByProject(points, activeProjectId);
    setProjectPoints(filtered);
  }, [activeProjectId, points]);

  const onReset = useCallback(() => {
    setActiveProjectId(null);
    setSearchQuery("");
    setSelectedCrystalId(null);
  }, []);

  const onSelectPoint = useCallback((point: NebulaPoint) => {
    if (point.type === "crystal") setSelectedCrystalId(point.id);
  }, []);

  // Archive Mode 关闭时重置状态
  const onArchiveClose = useCallback(() => {
    setViewMode("nebula");
  }, []);

  // 处理搜索 - 先展示动画，再跳转到 AI 工作台
  const handleNavigateToWorkbench = useCallback((query: string) => {
    setSearchQuery(query);
    setSearchStage("searching");
    setSearchProgress(0);
    setAiReasoning([]);
    setFinalDocument("");
    setShowResultPanel(false);
    
    // 3秒搜索动画
    const duration = 3000;
    const interval = 30;
    let elapsed = 0;
    
    if (searchTimerRef.current) {
      clearInterval(searchTimerRef.current);
    }
    
    searchTimerRef.current = setInterval(() => {
      elapsed += interval;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setSearchProgress(progress);
      
      // 2秒后开始显示推理步骤
      if (elapsed >= 2000) {
        const steps = [
          "分析问题：理解用户对第二大脑产品的定义需求...",
          "检索知识库：发现设计、交互、用户体验相关记录...",
          "整合信息：找到用户现有的产品理念和目标...",
          "生成方案：结合最佳实践和产品定位..."
        ];
        
        let index = 0;
        const stepTimer = setInterval(() => {
          setAiReasoning(prev => {
            if (index < steps.length && prev.length === index) {
              return [...prev, steps[index++]];
            }
            if (index >= steps.length) {
              clearInterval(stepTimer);
            }
            return prev;
          });
        }, 500);
      }
      
      if (elapsed >= duration) {
        if (searchTimerRef.current) {
          clearInterval(searchTimerRef.current);
          searchTimerRef.current = null;
        }
        setSearchProgress(100);
        setSearchStage("reasoning");
        
        // 动画完成后，跳转到 AI 工作台
        const encodedQuery = encodeURIComponent(query);
        setTimeout(() => {
          router.push(`/ai-workbench?query=${encodedQuery}`);
        }, 2000);
      }
    }, interval);
  }, [router]);

  // 显示最终文档
  const showFinalDocument = useCallback(() => {
    const doc = `产品定义：第二大脑 - 智能知识可视化引擎

## 一、产品愿景
成为用户第二大脑的智能知识管理中心，帮助用户：
- 可视化呈现个人知识体系
- 发现知识之间的隐藏联系
- 提升信息检索和思考效率

## 二、核心功能
1. **知识星云可视化**
   - 以星云形式展示知识节点
   - 支持 3D/2D 自由切换
   - 按分类、重要性智能着色

2. **智能分类与关联**
   - 自动识别内容类别
   - 发现跨领域的知识关联
   - 支持手动调整和优化

3. **搜索与推理**
   - 自然语言搜索
   - 上下文相关的智能推荐
   - 思维链推理展示

## 三、用户价值
- **不再遗忘**：重要信息可视化存储
- **发现洞察**：看到以前看不到的联系
- **提升效率**：快速定位所需知识

## 四、差异化定位
区别于传统笔记软件，我们强调：
- 可视化优先：图形化展示替代纯文字列表
- 关联发现：自动发现知识间的隐藏联系
- 思维辅助：不仅仅是存储，更是思考的延伸`;

    // 流式显示文档
    const lines = doc.split('\n');
    let lineIndex = 0;
    
    const docTimer = setInterval(() => {
      if (lineIndex < lines.length) {
        setFinalDocument(prev => prev + (prev ? '\n' : '') + lines[lineIndex]);
        lineIndex++;
      } else {
        clearInterval(docTimer);
        setSearchStage("complete");
        setFinalSearchTime(searchProgress * 30); // 记录最终搜索时间值
        
        // 动画完成 2 秒后显示结果面板
        setTimeout(() => {
          setShowResultPanel(true);
        }, 2000);
      }
    }, 100);
  }, []);

  // 添加到知识库
  const handleAddToKnowledge = useCallback(() => {
    alert("新知识已添加到知识库！星云中将会出现新的节点。");
    // 这里可以添加实际的入库逻辑
  }, []);

  // 返回星云视图
  const handleBackToNebula = useCallback(() => {
    setSearchStage("idle");
    setSearchQuery("");
    setSearchProgress(0);
    setAiReasoning([]);
    setFinalDocument("");
    setShowResultPanel(false);
    setViewMode("nebula");
  }, []);

  return (
    <div className="relative w-full h-full bg-void">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-void z-20">
          <span className="text-white/60 animate-pulse">加载星云数据...</span>
        </div>
      ) : null}

      {/* 视图模式切换按钮 */}
      {viewMode === "archive" && searchStage === "idle" && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setViewMode("nebula")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-sm text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            返回星云
          </button>
        </div>
      )}

      {/* 视图模式切换按钮 */}
      {searchStage === "idle" && (
        <ViewModeToggle mode={viewMode === "search" ? "nebula" : viewMode} onChange={setViewMode as any} />
      )}

      {/* Archive Mode - 三栏式布局 */}
      {viewMode === "archive" && searchStage === "idle" && (
        <ArchiveMode 
          onClose={onArchiveClose} 
          points={allPoints}
          projects={projects}
        />
      )}

      {/* Nebula Mode - 完整星云视图 */}
      {viewMode === "nebula" && searchStage === "idle" && (
        <NebulaCanvas
          points={points}
          projectPoints={projectPoints}
          projects={projects}
          activeProjectId={activeProjectId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectProject={setActiveProjectId}
          onSelectPoint={onSelectPoint}
        />
      )}

      {/* Search Mode - 搜索结果布局 */}
      {searchStage !== "idle" && (
        <div className="absolute inset-0 flex flex-col z-20">
          {/* 返回按钮 - 最高层级 */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={handleBackToNebula}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 rounded-lg text-sm text-white transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              返回星云
            </button>
          </div>
          
          {/* 顶部：缩小的星云预览 */}
          <div className="flex-1 relative">
            <NebulaCanvas
              points={allPoints}
              projectPoints={[]}
              projects={projects}
              activeProjectId={null}
              searchQuery={searchQuery}
              onSearchChange={() => {}}
              onSelectProject={() => {}}
              onSelectPoint={() => {}}
              compactMode={true}
              searchHighlight={true}
              searchTime={finalSearchTime > 0 ? finalSearchTime : searchProgress * 30}
            />
            
            {/* 动画完成指示器 */}
            {searchStage === "searching" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-white text-sm">搜索分析中...</span>
              </div>
            )}
            
            {/* 推理步骤显示 */}
            {searchStage === "reasoning" && aiReasoning.length > 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-white text-sm">即将进入 AI 工作台...</span>
              </div>
            )}
          </div>
          
          {/* 底部过渡提示面板 */}
          <div className="bg-gray-900/95 border-t border-gray-800 p-6">
            {/* 进度条 */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">
                  {searchStage === "searching" ? "正在分析您的问题..." : "正在准备跳转到 AI 工作台..."}
                </span>
                <span className="text-blue-400 text-sm">{Math.round(searchProgress)}%</span>
              </div>
              
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
              
              {/* 推理步骤 */}
              {aiReasoning.length > 0 && (
                <div className="mt-4 space-y-2">
                  {aiReasoning.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              )}
              
              {/* 跳转到工作台提示 */}
              {searchStage === "reasoning" && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  正在跳转到 AI 工作台...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 底部：搜索框 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <SearchInput 
          onNavigateToWorkbench={handleNavigateToWorkbench}
        />
      </div>
    </div>
  );
}

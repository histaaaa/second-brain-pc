"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import type { NebulaPoint } from "@/lib/db/local-data";
import type { CategoryId } from "@/lib/categories";
import { CATEGORIES, getPointColor } from "@/lib/categories";
import {
  type NebulaPoint2D,
  type NebulaCluster,
  type CategoryMeta,
  type CameraState,
  type TargetCameraState,
  type MouseState,
  type ZoomLevel,
} from "./types";
import { ProjectSidebar } from "./ProjectSidebar";
import { TimelinePanel } from "./TimelinePanel";

// ============== 常量配置 ==============

const CONFIG = {
  // 渲染配置
  pointCount: 1200,
  baseRadius: 250,
  clusterRadius: 100,
  zoomMin: 0.3,
  zoomMax: 2.5,
  zoomSpeed: 0.001,
  lerpFactor: 0.1,
  particleSpeed: 0.15,
  searchClusterRadius: 100,
  hitRadiusBase: 20,
  
  // 视觉配置 - 更亮
  baseOpacity: 0.15,
  maxOpacity: 0.8,
  starProbability: 0.03,
};

// ============== 工具函数 ==============

// 高斯分布函数 (Box-Muller Transform)
function gaussianRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * stdDev + mean;
}

// 获取类别标签
function getCategoryLabel(id: CategoryId): string {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat?.label ?? id;
}

// ============== 数据转换函数 ==============

/**
 * 将 NebulaPoint 数组转换为 2D 格式
 */
function convertTo2DPoints(
  points: NebulaPoint[],
  config: typeof CONFIG
): {
  points2D: NebulaPoint2D[];
  clusters: NebulaCluster[];
  categoryMeta: CategoryMeta[];
} {
  const points2D: NebulaPoint2D[] = [];
  const clusters: NebulaCluster[] = [];
  const categoryMeta: CategoryMeta[] = [];

  // 1. 创建类别锚点
  const categories = CATEGORIES;
  const categoryCount = categories.length;
  
  categories.forEach((cat, catIdx) => {
    const baseAngle = (catIdx / categoryCount) * Math.PI * 2;
    const angleJitter = (Math.random() - 0.5) * 1.5;
    const finalAngle = baseAngle + angleJitter;
    const dist = config.baseRadius + Math.random() * config.baseRadius;
    
    const cx = Math.cos(finalAngle) * dist;
    const cy = Math.sin(finalAngle) * dist;
    
    categoryMeta.push({
      id: cat.id,
      label: cat.label,
      color: cat.color,
      x: cx,
      y: cy,
    });
  });

  // 2. 为每个类别创建话题簇
  const clustersPerCategory: Record<string, string[]> = {
    DESIGN: ["UI设计", "UX研究", "视觉设计", "品牌设计", "动效设计", "设计系统"],
    HCI: ["用户研究", "交互设计", "可用性测试", "信息架构", "原型设计", "数据可视化"],
    RELATIONSHIPS: ["朋友", "家人", "同事", "导师", "社交活动", "人脉维护"],
    TRAVEL: ["出行计划", "景点攻略", "住宿选择", "美食探店", "旅行见闻", "行前准备"],
    FINANCE: ["投资理财", "储蓄计划", "消费记录", "保险配置", "税务规划", "财务自由"],
    WORK: ["项目进度", "会议纪要", "任务清单", "协作沟通", "职业发展", "工作总结"],
    LEARNING: ["读书笔记", "在线课程", "技能提升", "知识管理", "学习方法", "学习计划"],
    ENTERTAINMENT: ["电影", "游戏", "音乐", "综艺", "追剧", "ACG"],
    HEALTH: ["身体检查", "心理健康", "睡眠质量", "饮食营养", "运动恢复", "养生习惯"],
  };

  const categoryClusters: Array<{
    cluster: NebulaCluster;
    categoryId: CategoryId;
  }> = [];

  categories.forEach((cat) => {
    const seeds = clustersPerCategory[cat.id] || ["通用"];
    const numTopics = 3 + Math.floor(Math.random() * 4); // 3-6 个话题
    
    const shuffledSeeds = seeds.sort(() => Math.random() - 0.5);
    const selectedSeeds = shuffledSeeds.slice(0, numTopics);
    
    const catMeta = categoryMeta.find((m) => m.id === cat.id)!;
    
    selectedSeeds.forEach((label, topicIdx) => {
      const driftAngle = Math.random() * Math.PI * 2;
      const driftDist = Math.random() * config.clusterRadius;
      
      clusters.push({
        id: `cluster-${cat.id}-${topicIdx}`,
        label: label,
        category: cat.id,
        categoryLabel: cat.label,
        color: cat.color,
        x: catMeta.x + Math.cos(driftAngle) * driftDist,
        y: catMeta.y + Math.sin(driftAngle) * driftDist,
      });
      
      categoryClusters.push({
        cluster: clusters[clusters.length - 1],
        categoryId: cat.id,
      });
    });
  });

  // 3. 生成 2D 点 - 按实际类别聚类
  points.forEach((point) => {
    // 获取点的类别（支持旧类别映射）
    const categoryId = getCategoryIdFromPoint(point.category);
    
    // 找到该类别对应的所有簇
    const categoryClusters = clusters.filter((c) => c.category === categoryId);
    
    if (categoryClusters.length === 0) {
      // 如果没有找到对应类别，使用第一个簇（兜底）
      const cluster = clusters[0];
      const spread = 60 + Math.random() * 40;
      const px = gaussianRandom(cluster.x, spread);
      const py = gaussianRandom(cluster.y, spread);
      addPointTo2D(point, px, py);
    } else {
      // 随机选择一个该类别的簇
      const cluster = categoryClusters[Math.floor(Math.random() * categoryClusters.length)];
      const spread = 60 + Math.random() * 40;
      const px = gaussianRandom(cluster.x, spread);
      const py = gaussianRandom(cluster.y, spread);
      addPointTo2D(point, px, py);
    }
  });

  function addPointTo2D(point: NebulaPoint, px: number, py: number) {
    // 96% 是小粒子，4% 是大恒星
    const isStar = Math.random() < CONFIG.starProbability;
    const size = isStar
      ? 2.5 + Math.random() * 1.5  // 大恒星: 2.5-4
      : 1 + Math.random() * 0.8; // 小粒子: 1-1.8
    
    points2D.push({
      id: point.id,
      type: point.type,
      content: point.content,
      title: point.title,
      category: getCategoryIdFromPoint(point.category) as CategoryId,
      timestamp: point.timestamp,
      importance: point.importance,
      shape: point.shape,
      projectIds: point.projectIds,
      
      x: px,
      y: py,
      originX: px,
      originY: py,
      targetX: px,
      targetY: py,
      size: size,
      baseOpacity: CONFIG.baseOpacity + Math.random() * 0.5,
      opacity: 0, // 初始为 0，淡入动画
      targetOpacity: 1, // 目标透明度
      pulseOffset: Math.random() * 10,
      color: getPointColor(point.category),
    });
  }

  // 辅助函数：从点获取类别ID（支持映射）
  function getCategoryIdFromPoint(category: string): string {
    const mapping: Record<string, string> = {
      CAREER: "WORK",
      GROWTH: "LEARNING",
      FAMILY: "RELATIONSHIPS",
      LEISURE: "ENTERTAINMENT",
      SOCIAL: "RELATIONSHIPS",
      WEALTH: "FINANCE",
      TRAVEL_OLD: "TRAVEL",
      DESIGN_OLD: "DESIGN",
      HCI_OLD: "HCI",
    };
    return mapping[category] || category;
  }

  return { points2D, clusters, categoryMeta };
}

// ============== 主组件 ==============

interface Project {
  id: string;
  name: string;
}

interface NebulaCanvasProps {
  points: NebulaPoint[];
  projectPoints: NebulaPoint[];
  projects: Project[];
  activeProjectId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProject: (projectId: string | null) => void;
  onSelectPoint: (point: NebulaPoint) => void;
}

export function NebulaCanvas({
  points,
  projectPoints,
  projects,
  activeProjectId,
  searchQuery,
  onSearchChange,
  onSelectProject,
  onSelectPoint,
}: NebulaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [hoveredNode, setHoveredNode] = useState<NebulaPoint2D | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<NebulaPoint2D | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("Overview");
  const [timelineProject, setTimelineProject] = useState<{ id: string; name: string; points: NebulaPoint[] } | null>(null);
  
  // Refs 用于高性能更新
  const dataRef = useRef<{
    points: NebulaPoint2D[];
    clusters: NebulaCluster[];
    categoryMeta: CategoryMeta[];
  }>({ points: [], clusters: [], categoryMeta: [] });
  
  const cameraRef = useRef<CameraState>({ x: 0, y: 0, zoom: 0.5 });
  const targetCameraRef = useRef<TargetCameraState>({ x: 0, y: 0, zoom: 0.5 });
  const mouseRef = useRef<MouseState>({ isDown: false, lastX: 0, lastY: 0, lastClickX: 0, lastClickY: 0 });
  const frameIdRef = useRef<number>(0);
  
  // 初始化数据
  useEffect(() => {
    const { points2D, clusters, categoryMeta } = convertTo2DPoints(points, CONFIG);
    dataRef.current = { points: points2D, clusters, categoryMeta };
  }, [points]);
  
  // 搜索效果
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    const isSearching = query.length > 0;
    
    // 搜索时自动聚焦中心
    if (isSearching) {
      targetCameraRef.current = { x: 0, y: 0, zoom: 1.0 };
    }
    
    dataRef.current.points.forEach((p) => {
      if (isSearching) {
        const match = p.content.toLowerCase().includes(query) ||
                      p.title?.toLowerCase().includes(query) ||
                      p.category.toLowerCase().includes(query);
        
        if (match) {
          // 匹配点：聚集成紧密的球体
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * CONFIG.searchClusterRadius * Math.random();
          p.targetX = Math.cos(angle) * r;
          p.targetY = Math.sin(angle) * r;
          p.targetOpacity = 1;
        } else {
          // 未匹配点：隐身并归位
          p.targetX = p.originX;
          p.targetY = p.originY;
          p.targetOpacity = 0.02;
        }
      } else {
        // 重置：回到有机分布
        p.targetX = p.originX;
        p.targetY = p.originY;
        p.targetOpacity = p.baseOpacity;
      }
    });
  }, [searchQuery]);
  
  // 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const render = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // 响应式尺寸
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      
      // 清空画布
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      
      // 相机平滑插值
      const cam = cameraRef.current;
      const target = targetCameraRef.current;
      cam.x += (target.x - cam.x) * CONFIG.lerpFactor;
      cam.y += (target.y - cam.y) * CONFIG.lerpFactor;
      cam.zoom += (target.zoom - cam.zoom) * CONFIG.lerpFactor;
      
      // 更新视图模式状态
      if (cam.zoom > 0.75 && zoomLevel !== "Detailed") {
        setZoomLevel("Detailed");
      }
      if (cam.zoom <= 0.75 && zoomLevel !== "Overview") {
        setZoomLevel("Overview");
      }
      
      // 开始绘制世界
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-cam.x, -cam.y);
      
      const t = time * 0.001;
      const isSearching = searchQuery.length > 0;
      
      // 1. 绘制背景网格
      drawBackgroundGrid(ctx, cam, w, h);
      
      // 2. 绘制粒子 - 使用 lighter 混合模式产生发光效果
      ctx.globalCompositeOperation = "screen";
      drawParticles(ctx, dataRef.current.points, t, isSearching);
      ctx.globalCompositeOperation = "source-over";
      
      // 3. 绘制 LOD 元素
      if (!isSearching) {
        drawCategoryLabels(ctx, dataRef.current.categoryMeta, cam);
        drawClusterLabels(ctx, dataRef.current.clusters, cam);
      }
      
      ctx.restore();
      
      frameIdRef.current = requestAnimationFrame(render);
    };
    
    frameIdRef.current = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [searchQuery, zoomLevel]);
  
  // 事件处理
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(
      CONFIG.zoomMin,
      Math.min(CONFIG.zoomMax, targetCameraRef.current.zoom - e.deltaY * CONFIG.zoomSpeed)
    );
    targetCameraRef.current.zoom = newZoom;
  }, []);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
    mouseRef.current.lastClickX = e.clientX;
    mouseRef.current.lastClickY = e.clientY;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cam = cameraRef.current;
    
    // 拖拽平移
    if (mouseRef.current.isDown) {
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;
      const speed = 1 / cam.zoom;
      targetCameraRef.current.x -= dx * speed;
      targetCameraRef.current.y -= dy * speed;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
      return;
    }
    
    // 悬停检测
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // 屏幕坐标 -> 世界坐标
    const worldX = (mx - rect.width / 2) / cam.zoom + cam.x;
    const worldY = (my - rect.height / 2) / cam.zoom + cam.y;
    
    const hitRadiusSq = Math.pow(CONFIG.hitRadiusBase / cam.zoom, 2);
    const points = dataRef.current.points;
    
    let found: NebulaPoint2D | null = null;
    
    // 倒序遍历，优先检测上层点
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      if (p.opacity < 0.2) continue;
      
      const distSq = Math.pow(p.x - worldX, 2) + Math.pow(p.y - worldY, 2);
      if (distSq < hitRadiusSq) {
        found = p;
        break;
      }
    }
    
    setHoveredNode(found);
  }, []);
  
  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    // 如果正在拖拽，不触发点击
    const dx = Math.abs(e.clientX - mouseRef.current.lastClickX);
    const dy = Math.abs(e.clientY - mouseRef.current.lastClickY);
    if (dx > 5 || dy > 5) return;
    
    if (hoveredNode) {
      setSelectedPoint(hoveredNode);
    } else {
      setSelectedPoint(null);
    }
  }, [hoveredNode]);
  
  const handleReset = useCallback(() => {
    targetCameraRef.current = { x: 0, y: 0, zoom: 0.5 };
  }, []);
  
  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050505] overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      />
      
      {/* 标题栏 */}
      <NebulaHeader
        isSearching={searchQuery.length > 0}
        zoomLevel={zoomLevel}
      />
      
      {/* 悬停详情卡片 */}
      {hoveredNode && !selectedPoint && (
        <NebulaTooltip
          point={hoveredNode}
          camera={cameraRef.current}
        />
      )}

      {/* 点击详情面板 */}
      {selectedPoint && (
        <NebulaDetailPanel
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}

      {/* 搜索栏 */}
      <NebulaSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onReset={handleReset}
      />
      
      {/* 项目侧边栏 */}
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={onSelectProject}
        projectPoints={projectPoints}
        onOpenTimeline={(projectId, points) => {
          const project = projects.find(p => p.id === projectId);
          if (project) {
            setTimelineProject({ id: projectId, name: project.name, points });
          }
        }}
      />
      
      {/* 时间线面板 */}
      {timelineProject && (
        <TimelinePanel
          projectName={timelineProject.name}
          points={timelineProject.points}
          onClose={() => setTimelineProject(null)}
          onSelectPoint={onSelectPoint}
        />
      )}
    </div>
  );
}

// ============== 辅助绘制函数 ==============

function drawBackgroundGrid(
  ctx: CanvasRenderingContext2D,
  cam: CameraState,
  w: number,
  h: number
) {
  // 60px 网格
  const gridSize = 60;
  const offsetX = -cam.x * cam.zoom + w / 2;
  const offsetY = -cam.y * cam.zoom + h / 2;
  
  ctx.save();
  ctx.strokeStyle = "rgba(68, 68, 68, 0.1)";
  ctx.lineWidth = 1;
  
  const startX = (-offsetX % gridSize) / cam.zoom;
  const startY = (-offsetY % gridSize) / cam.zoom;
  
  ctx.beginPath();
  for (let x = startX; x < w / cam.zoom; x += gridSize / cam.zoom) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h / cam.zoom);
  }
  for (let y = startY; y < h / cam.zoom; y += gridSize / cam.zoom) {
    ctx.moveTo(0, y);
    ctx.lineTo(w / cam.zoom, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  points: NebulaPoint2D[],
  time: number,
  isSearching: boolean
) {
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    
    // 物理运动
    p.x += (p.targetX - p.x) * CONFIG.particleSpeed;
    p.y += (p.targetY - p.y) * CONFIG.particleSpeed;
    p.opacity += (p.targetOpacity - p.opacity) * CONFIG.particleSpeed;
    
    if (p.opacity < 0.01) continue;
    
    const pulse = Math.sin(time * 2 + p.pulseOffset);
    const size = p.size * (1 + pulse * 0.15);
    
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCategoryLabels(
  ctx: CanvasRenderingContext2D,
  categoryMeta: CategoryMeta[],
  cam: CameraState
) {
  const catAlpha = Math.max(0, Math.min(1, (0.8 - cam.zoom) * 3));
  if (catAlpha < 0.01) return;
  
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 56px SourceHanSerifCN, serif";
  
  categoryMeta.forEach((cat) => {
    ctx.save();
    ctx.globalAlpha = catAlpha * 0.3;
    ctx.fillStyle = cat.color;
    ctx.fillText(cat.label, cat.x, cat.y);
    ctx.restore();
  });
}

function drawClusterLabels(
  ctx: CanvasRenderingContext2D,
  clusters: NebulaCluster[],
  cam: CameraState
) {
  const topicAlpha = Math.max(0, Math.min(1, (cam.zoom - 0.5) * 2)) * 0.3;
  if (topicAlpha < 0.01) return;
  
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "500 9px SourceHanSerifCN, serif";
  
  clusters.forEach((cluster) => {
    ctx.save();
    ctx.globalAlpha = topicAlpha;
    
    // 文字描边
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    ctx.strokeText(cluster.label, cluster.x, cluster.y);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(cluster.label, cluster.x, cluster.y);
    
    // 小圆点指示器
    ctx.fillStyle = cluster.color;
    ctx.beginPath();
    ctx.arc(cluster.x, cluster.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
}

// ============== UI 组件 ==============

function NebulaHeader({
  isSearching,
  zoomLevel,
}: {
  isSearching: boolean;
  zoomLevel: ZoomLevel;
}) {
  return (
    <div className="absolute top-6 left-6 z-20 pointer-events-none">
      {/* 标题栏已简化 - 仅保留状态指示 */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono uppercase tracking-widest ${
          isSearching ? "text-orange-400" : "text-gray-500"
        }`}>
          {isSearching ? "筛选模式" : "有机模式"}
        </span>
      </div>
    </div>
  );
}

function NebulaTooltip({
  point,
  camera,
}: {
  point: NebulaPoint2D;
  camera: CameraState;
}) {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: "50%",
        top: "20%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="glass px-5 py-4 rounded-xl border-l-2 shadow-2xl flex flex-col items-center text-center max-w-xs"
        style={{ borderColor: point.color }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80"
          style={{ color: point.color }}
        >
          {getCategoryLabel(point.category)}
        </span>
        <span className="text-sm text-white font-medium leading-snug">
          {point.title || point.content}
        </span>
      </div>
    </div>
  );
}

function NebulaDetailPanel({
  point,
  onClose,
}: {
  point: NebulaPoint2D;
  onClose: () => void;
}) {
  const date = new Date(point.timestamp).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="absolute top-4 right-4 z-40 w-80 animate-in slide-in-from-right duration-300">
      <div className="glass rounded-2xl overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div
          className="px-5 py-4 border-b border-white/10 flex items-center justify-between"
          style={{ backgroundColor: `${point.color}20` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: point.color, boxShadow: `0 0 10px ${point.color}` }}
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: point.color }}>
              {getCategoryLabel(point.category)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5">
          <h3 className="text-lg text-white font-medium mb-3 leading-relaxed">
            {point.title || point.content}
          </h3>

          {point.content !== point.title && (
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {point.content}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-xs">schedule</span>
            <span>{date}</span>
          </div>

          {point.projectIds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                所属项目
              </span>
              <div className="flex flex-wrap gap-2">
                {point.projectIds.map((projectId) => (
                  <span
                    key={projectId}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                  >
                    {projectId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NebulaSearchBar({
  value,
  onChange,
  onReset,
}: {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 px-6 pointer-events-none">
      <div className="glass w-full max-w-lg rounded-2xl p-1.5 pointer-events-auto flex items-center shadow-2xl">
        <div className="flex items-center flex-1 px-3 h-10 bg-white/5 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-gray-500 mr-2 text-lg">
            search
          </span>
          <input
            className="bg-transparent border-none outline-none w-full text-white placeholder-gray-600 font-light text-base"
            placeholder="搜索记忆..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="p-1 hover:bg-white/10 rounded-full"
            >
              <span className="material-symbols-outlined text-gray-500 text-sm">
                close
              </span>
            </button>
          )}
        </div>
        {!value && (
          <button
            onClick={onReset}
            className="ml-3 px-3 py-1 text-[10px] font-mono text-gray-500 hover:text-white transition-colors"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  );
}

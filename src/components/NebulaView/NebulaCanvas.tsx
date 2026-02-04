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
  type TimelineViewMode,
} from "./types";
import { ProjectSidebar } from "./ProjectSidebar";
import { TimelinePanel } from "./TimelinePanel";
import { ProjectInfoCard } from "./ProjectInfoCard";
import { CrystalEditorPanel } from "./CrystalEditorPanel";

// ============== 常量配置 ==============

const CONFIG = {
  // 渲染配置
  pointCount: 1200,
  baseRadius: 250,
  clusterRadius: 100,
  zoomMin: 0.3,
  zoomMax: 2.5,
  zoomSpeed: 0.001,
  lerpFactor: 0.08,
  particleSpeed: 0.15,
  searchClusterRadius: 100,
  hitRadiusBase: 20,
  
  // 视觉配置 - 更亮
  baseOpacity: 0.15,
  maxOpacity: 0.8,
  starProbability: 0.03,
  
  // 动态效果配置
  driftSpeed: 0.0003,      // 点漂浮速度
  driftRadius: 15,        // 漂浮范围
  breatheSpeed: 0.002,     // 呼吸速度
  breatheAmount: 0.15,    // 呼吸强度
  
  // 结晶点击配置
  crystalOffsetRatio: 0.25,  // 结晶在点击时距离左边界的比例（0.25 = 屏幕宽度的25%位置）
  crystalClickZoom: 1.5,     // 点击结晶时的缩放倍率

  // 时间线视图配置
  timelineDriftSpeed: 0.00015,
  timelineDriftRadius: 2,        
  timelineSpacingY: 12,           // 垂直间距（更紧凑）
  timelineXOffset: 500,         // 时间线X位置（向右偏移300px）
  timelineLineThickness: 8,      
  timelineParticleDensity: 0.3,
  timelineDateLabelX: 80,
  timelineHeight: 1000,          // 时间线固定长度 1000px
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

  // 2. 随机生成分类位置（带碰撞检测）
  const categories = CATEGORIES;
  
  // 约束条件
  const minDistance = 200;    // 分类中心之间最小距离（防止重叠）
  const maxDistance = 450;    // 最大距离（不超出范围）
  const minCenterDist = 100;  // 离中心最小距离
  
  // 随机打乱分类顺序
  const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
  
  shuffledCategories.forEach((cat) => {
    let attempts = 0;
    let placed = false;
    
    while (!placed && attempts < 200) {
      // 随机角度和距离
      const angle = Math.random() * Math.PI * 2;
      const dist = minCenterDist + Math.random() * (maxDistance - minCenterDist);
      
      const cx = Math.cos(angle) * dist;
      const cy = Math.sin(angle) * dist;
      
      // 碰撞检测：检查是否与现有分类重叠
      const overlapping = categoryMeta.some(existing => {
        const dx = existing.x - cx;
        const dy = existing.y - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
      
      if (!overlapping) {
        categoryMeta.push({
          id: cat.id,
          label: cat.label,
          color: cat.color,
          x: cx,
          y: cy,
        });
        placed = true;
      }
      
      attempts++;
    }
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
      const driftDist = Math.random() * config.clusterRadius * 1.5; // 更松散的话题簇间距
      
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
      const spread = 50 + Math.random() * 30; // 缩拢
      const px = gaussianRandom(cluster.x, spread);
      const py = gaussianRandom(cluster.y, spread);
      addPointTo2D(point, px, py);
    } else {
      // 随机选择一个该类别的簇
      const cluster = categoryClusters[Math.floor(Math.random() * categoryClusters.length)];
      const spread = 50 + Math.random() * 30; // 缩拢
      const px = gaussianRandom(cluster.x, spread);
      const py = gaussianRandom(cluster.y, spread);
      addPointTo2D(point, px, py);
    }
  });

  function addPointTo2D(point: NebulaPoint, px: number, py: number) {
    // 结晶比星尘大很多，更容易辨认
    const isCrystal = point.type === "crystal";
    
    let size: number;
    if (isCrystal) {
      // 结晶：固定大尺寸，2-3 范围（调小）
      size = 3 + Math.random() * 0.8;
    } else if (Math.random() < CONFIG.starProbability) {
      // 4% 是大恒星: 1.5-2（调小）
      size = 1.2 + Math.random() * 0.5;
    } else {
      // 小粒子: 0.3-0.6（调小）
      size = 0.6 + Math.random() * 0.4;
    }
    
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
      sourceStardustIds: point.sourceStardustIds,
      
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
  compactMode?: boolean;
  searchHighlight?: boolean;
  searchProgress?: number;
  searchTime?: number; // 搜索动画时间进度 (ms)
  timelineView?: "normal" | "timeline";
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
  compactMode = false,
  searchHighlight = false,
  searchProgress = 0,
  searchTime = 0,
}: NebulaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [hoveredNode, setHoveredNode] = useState<NebulaPoint2D | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<NebulaPoint2D | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("Overview");
  const [timelineView, setTimelineView] = useState<TimelineViewMode>("nebula");
  const [timelineProject, setTimelineProject] = useState<{ id: string; name: string; points: NebulaPoint[] } | null>(null);
  const [showProjectCard, setShowProjectCard] = useState(false); // 粒子汇聚完成后显示卡片
  
  // Refs 用于高性能更新
  const dataRef = useRef<{
    points: NebulaPoint2D[];
    clusters: NebulaCluster[];
    categoryMeta: CategoryMeta[];
  }>({ points: [], clusters: [], categoryMeta: [] });
  
  // 用于保存当前可见点，供鼠标检测使用
  const visiblePointsRef = useRef<NebulaPoint2D[]>([]);
  
  // 用于点击检测的悬停点
  const hoveredPointRef = useRef<NebulaPoint2D | null>(null);
  
  const cameraRef = useRef<CameraState>({ x: 0, y: 0, zoom: 0.5 });
  const targetCameraRef = useRef<TargetCameraState>({ x: 0, y: 0, zoom: 0.5 });
  const mouseRef = useRef<MouseState>({ isDown: false, lastX: 0, lastY: 0, lastClickX: 0, lastClickY: 0 });
  const frameIdRef = useRef<number>(0);
  
  // 初始化数据
  useEffect(() => {
    const { points2D, clusters, categoryMeta } = convertTo2DPoints(points, CONFIG);
    dataRef.current = { points: points2D, clusters, categoryMeta };
  }, [points]);
  
  // 搜索效果 - 三阶段动画：检索期 → 激活期 → 聚合期
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    const isSearching = query.length > 0;
    
    // 如果 searchTime 为 0，跳过动画计算
    if (searchTime <= 0) {
      dataRef.current.points.forEach((p) => {
        p.targetX = p.originX;
        p.targetY = p.originY;
        p.targetOpacity = p.baseOpacity;
        p.searchType = undefined;
      });
      return;
    }
    
    // 调试日志：显示搜索词和匹配情况
    if (isSearching && searchHighlight) {
      const exactMatches = dataRef.current.points.filter(p => 
        p.content.toLowerCase().includes(query) || 
        (p.title && p.title.toLowerCase().includes(query))
      );
      const categoryMatches = dataRef.current.points.filter(p => 
        p.category.toLowerCase().includes(query)
      );
      console.log(`搜索 "${query}": 精确匹配=${exactMatches.length}, 分类匹配=${categoryMatches.length}`);
    }
    
    // 搜索时自动聚焦中心
    if (isSearching) {
      targetCameraRef.current = { x: 0, y: 0, zoom: 1.0 };
    }
    
    // 分类所有点
    const pointsWithScore = dataRef.current.points.map((p, idx) => {
      const contentLower = p.content.toLowerCase();
      const titleLower = p.title?.toLowerCase() || "";
      const categoryLower = p.category.toLowerCase();
      
      // 计算匹配分数
      let score = 0;
      let matchType = 0;
      
      // 核心匹配（内容包含搜索词）- 最高分
      if (contentLower.includes(query) || titleLower.includes(query)) {
        score = 3;
        matchType = 2;
      }
      // 分类匹配 - 中等分
      else if (categoryLower.includes(query)) {
        score = 2;
        matchType = 1;
      }
      // 关键词匹配（搜索词分词后匹配）- 较低分
      else {
        const keywords = query.split(" ").filter(w => w.length > 1);
        const keywordMatchCount = keywords.filter(k => contentLower.includes(k)).length;
        if (keywordMatchCount > 0) {
          score = 1 + keywordMatchCount * 0.5;
          matchType = 1;
        }
      }
      
      return { point: p, score, matchType, idx };
    });
    
    // 排序：按匹配分数降序
    pointsWithScore.sort((a, b) => b.score - a.score);
    
    // 确保至少点亮30个粒子
    const MIN_HIGHLIGHT_COUNT = 30;
    const totalPoints = dataRef.current.points.length;
    
    // 选择需要点亮的点
    const pointsToHighlight: number[] = [];
    
    // 1. 先添加有匹配分数的点
    pointsWithScore.forEach(item => {
      if (item.score > 0 && pointsToHighlight.length < MIN_HIGHLIGHT_COUNT) {
        pointsToHighlight.push(item.idx);
      }
    });
    
    // 2. 如果不够30个，补充其他点（按距离中心最远的优先）
    if (pointsToHighlight.length < MIN_HIGHLIGHT_COUNT) {
      const remainingPoints = pointsWithScore
        .filter(item => !pointsToHighlight.includes(item.idx))
        .sort((a, b) => {
          const distA = Math.sqrt(a.point.originX * a.point.originX + a.point.originY * a.point.originY);
          const distB = Math.sqrt(b.point.originX * b.point.originX + b.point.originY * b.point.originY);
          return distB - distA; // 远的优先
        });
      
      remainingPoints.forEach(item => {
        if (pointsToHighlight.length < MIN_HIGHLIGHT_COUNT) {
          pointsToHighlight.push(item.idx);
          // 补充的点标记为关联匹配
          item.matchType = item.matchType || 1;
        }
      });
    }
    
    // 确保分类多样性：每个分类至少一个代表
    const categoryCount: Record<string, number> = {};
    pointsToHighlight.forEach(idx => {
      const cat = dataRef.current.points[idx].category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    // 遍历所有分类，补充缺少的分类代表
    const categories = [...new Set(dataRef.current.points.map(p => p.category))];
    categories.forEach(cat => {
      if (!categoryCount[cat] || categoryCount[cat] === 0) {
        // 找到该分类中距离最远的点
        const catPoints = pointsWithScore
          .filter(item => item.point.category === cat && !pointsToHighlight.includes(item.idx))
          .sort((a, b) => {
            const distA = Math.sqrt(a.point.originX * a.point.originX + a.point.originY * a.point.originY);
            const distB = Math.sqrt(b.point.originX * b.point.originX + b.point.originY * b.point.originY);
            return distB - distA;
          });
        
        if (catPoints.length > 0 && pointsToHighlight.length < totalPoints) {
          pointsToHighlight.push(catPoints[0].idx);
          catPoints[0].matchType = 1; // 标记为关联匹配
        }
      }
    });
    
    console.log(`将点亮 ${pointsToHighlight.length} 个粒子`);
    
    // 计算动画进度
    const retrievalEnd = 1500;
    const activationEnd = 2800;
    const aggregationEnd = 3200;
    
    // 为每个点计算动画状态
    dataRef.current.points.forEach((p, idx) => {
      const isHighlighted = pointsToHighlight.includes(idx);
      const distFromCenter = Math.sqrt(p.originX * p.originX + p.originY * p.originY);
      const maxDist = 800;
      const distFactor = Math.min(1, distFromCenter / maxDist);
      const highlightIndex = pointsToHighlight.indexOf(idx);
      
      if (isSearching && searchHighlight) {
        if (isHighlighted) {
          const matchItem = pointsWithScore.find(item => item.idx === idx);
          const searchType = matchItem?.matchType || 1;
          
          if (searchTime < retrievalEnd) {
            // 检索期：点依次脉动（从外向内）
            const retrievalProgress = searchTime / retrievalEnd;
            // 高亮索引越小的越先脉动
            const pointProgress = retrievalProgress - (highlightIndex / pointsToHighlight.length) * 0.5;
            
            if (pointProgress > 0) {
              p.targetOpacity = 0.3 + Math.sin(searchTime * 0.02 + idx * 0.5) * 0.4;
              p.searchType = searchType;
            } else {
              p.targetOpacity = 0.1;
              p.searchType = searchType;
            }
            p.targetX = p.originX;
            p.targetY = p.originY;
          } 
          else if (searchTime < activationEnd) {
            // 激活期：点依次点亮
            const activationProgress = (searchTime - retrievalEnd) / (activationEnd - retrievalEnd);
            const pointProgress = activationProgress - (highlightIndex / pointsToHighlight.length) * 0.5;
            
            if (pointProgress > 0) {
              const lightUp = Math.min(1, pointProgress * 2);
              p.targetOpacity = 0.3 + lightUp * 0.7;
              p.searchType = searchType;
            } else {
              p.targetOpacity = 0.1;
              p.searchType = searchType;
            }
            p.targetX = p.originX;
            p.targetY = p.originY;
          } 
          else {
            // 聚合期：匹配点向中心坍缩
            const aggProgress = Math.min(1, (searchTime - activationEnd) / (aggregationEnd - activationEnd));
            const easedAgg = 1 - Math.pow(1 - aggProgress, 3);
            
            // 向中心聚合，但保持分类聚集
            const angle = Math.atan2(p.originY, p.originX);
            const dist = Math.sqrt(p.originX * p.originX + p.originY * p.originY);
            const targetDist = dist * (1 - easedAgg * 0.8); // 坍缩到 20%
            p.targetX = Math.cos(angle) * targetDist;
            p.targetY = Math.sin(angle) * targetDist;
            p.targetOpacity = 1;
            p.searchType = searchType;
          }
        } else {
          // 非高亮点：淡出
          if (searchTime < retrievalEnd) {
            p.targetOpacity = 0.02;
          } else if (searchTime < activationEnd) {
            p.targetOpacity = 0.02;
          } else {
            p.targetOpacity = 0.01;
          }
          p.targetX = p.originX;
          p.targetY = p.originY;
          p.searchType = 0;
        }
      } else {
        // 非搜索状态：回到有机分布
        p.targetX = p.originX;
        p.targetY = p.originY;
        p.targetOpacity = p.baseOpacity;
        p.searchType = undefined;
      }
    });
  }, [searchQuery, searchHighlight, searchTime]);
  
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
      
      // 确定当前显示模式
      let visiblePoints = dataRef.current.points;
      
      // 点击选中结晶：只显示结晶和来源星尘（重新组合成新星云）
      if (selectedPoint?.type === "crystal") {
        const sourceIds = selectedPoint.sourceStardustIds || [];
        visiblePoints = dataRef.current.points.filter(p => 
          p.id === selectedPoint.id || 
          (sourceIds.includes(p.id) && p.type === "dust")
        );
      }
      
      // 保存当前可见点，供鼠标检测使用
      visiblePointsRef.current = visiblePoints;
      
      drawParticles(ctx, visiblePoints, t, isSearching, selectedPoint, timelineView, timelineProject?.id || null, searchHighlight, searchTime);
      
      // 搜索动画进度指示
      if (searchHighlight && searchTime > 0) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          let stage = "";
          if (searchTime < 1500) stage = "🔍 检索中...";
          else if (searchTime < 2800) stage = "✨ 激活中...";
          else stage = "🌟 聚合中...";
          
          ctx.save();
          ctx.font = "24px sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillText(stage, w / 2, 60);
          
          // 进度条
          const progress = Math.min(1, searchTime / 3200);
          const barWidth = 200;
          const barHeight = 4;
          const barX = w / 2 - barWidth / 2;
          const barY = 80;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.fillRect(barX, barY, barWidth, barHeight);
          
          ctx.fillStyle = "#00ff88";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00ff88";
          ctx.fillRect(barX, barY, barWidth * progress, barHeight);
          
          ctx.restore();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      
      // 3. 绘制 LOD 元素 - 仅在非搜索、非选中状态显示
      if (!isSearching && !selectedPoint) {
        drawCategoryLabels(ctx, dataRef.current.categoryMeta, cam, timelineView, compactMode);
        drawClusterLabels(ctx, dataRef.current.clusters, cam);
        
        // 时间线视图：绘制时间线轴和日期标注
        if (timelineView === "timeline" && timelineProject) {
          drawTimelineAxis(ctx, cam, dataRef.current.points, timelineProject.id);
        }
      }
      
      // 检测粒子动画是否完成（用于控制项目卡片显示）
      if (timelineView === "timeline" && timelineProject) {
        // 只检查属于当前项目且正在进行飞入动画的粒子
        const anyFlying = dataRef.current.points.some(p => 
          p.projectIds.includes(timelineProject.id) && p.flyInProgress
        );
        
        // 如果有粒子在飞入动画中，不显示卡片；如果动画完成，延迟显示卡片
        if (anyFlying) {
          setShowProjectCard(false);
        } else if (!showProjectCard) {
          // 动画完成后，延迟 300ms 再显示卡片
          setTimeout(() => {
            setShowProjectCard(true);
          }, 300);
        }
      } else {
        // 退出时间线视图时，重置卡片显示状态
        setShowProjectCard(false);
      }
      
      ctx.restore();
      
      frameIdRef.current = requestAnimationFrame(render);
    };
    
    frameIdRef.current = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [searchQuery, zoomLevel, compactMode, searchHighlight, searchTime]);
  
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
    
    // 悬停检测 - 仅用于点击检测，不更新 UI
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // 屏幕坐标 -> 世界坐标
    const worldX = (mx - rect.width / 2) / cam.zoom + cam.x;
    const worldY = (my - rect.height / 2) / cam.zoom + cam.y;
    
    const hitRadiusSq = Math.pow(CONFIG.hitRadiusBase / cam.zoom, 2);
    // 使用过滤后的可见点进行检测（确保与渲染一致）
    const points = visiblePointsRef.current.length > 0 ? visiblePointsRef.current : dataRef.current.points;
    
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
    
    // 更新悬停状态（用于显示提示）
    setHoveredNode(found);
    // 保存用于点击检测
    hoveredPointRef.current = found;
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
    
    const rect = canvasRef.current?.getBoundingClientRect();
    const clickedPoint = hoveredPointRef.current;
    
    if (clickedPoint) {
      // 选中点
      if (clickedPoint.type === "crystal") {
        // 选中结晶
        setSelectedPoint(clickedPoint);
        
        // 如果是结晶，Zoom In 并触发飞入动画
        const sourceIds = clickedPoint.sourceStardustIds || [];
        
        // 计算结晶位置：往左移，给右边留出空间
        const offsetRatio = CONFIG.crystalOffsetRatio;
        const offsetX = rect ? (rect.width * offsetRatio) / CONFIG.crystalClickZoom : 250;
        
        // 为每个来源散点设置飞入起始位置
        dataRef.current.points.forEach(p => {
          if (sourceIds.includes(p.id) && p.type === "dust") {
            delete p.targetX;
            delete p.targetY;
            p.flyInStartX = p.x;
            p.flyInStartY = p.y;
            p.flyInStartTime = Date.now();
            p.flyInProgress = true;
          }
        });
        
        // 结晶点击：相机移动到结晶位置（Zoom In）
        targetCameraRef.current = {
          x: clickedPoint.x + offsetX,
          y: clickedPoint.y,
          zoom: CONFIG.crystalClickZoom,
        };
      } else {
        // 非结晶 - 如果不在时间线模式下，重置缩放
        if (timelineView !== "timeline") {
          setSelectedPoint(null);
          targetCameraRef.current = { x: 0, y: 0, zoom: 0.5 };
        }
      }
      
      // 回调给父组件
      onSelectPoint({
        ...clickedPoint,
        sourceStardustIds: clickedPoint.sourceStardustIds,
      } as NebulaPoint);
    } else {
      // 点击空白处，取消选择
      
      // 如果在时间线模式下，只取消选中，不触发飞回动画
      if (timelineView === "timeline" && timelineProject) {
        // 保持时间线视图状态
        return;
      }
      
      setSelectedPoint(null);
      
      // 取消选中时，散点飞回原位
      dataRef.current.points.forEach(p => {
        if (p.type === "dust" && p.originX !== undefined) {
          p.flyInStartX = p.x;
          p.flyInStartY = p.y;
          p.targetX = p.originX;  // 目标：飞回原始位置
          p.targetY = p.originY;
          p.flyInStartTime = Date.now();
          p.flyInProgress = true;
        }
      });
      
      // 相机保持不变
      // targetCameraRef.current 保持当前状态
    }
  }, [onSelectPoint]);
  
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
      
      {/* 悬停提示卡片 - 始终显示 */}
      {hoveredNode && (
        <NebulaTooltip
          point={hoveredNode}
          camera={cameraRef.current}
        />
      )}
      
      {/* 点击详情面板 */}
      {selectedPoint && selectedPoint.type === "crystal" ? (
        <CrystalEditorPanel
          point={selectedPoint}
          onClose={() => {
            setSelectedPoint(null);
            targetCameraRef.current = { x: 0, y: 0, zoom: 0.5 };
          }}
          onSave={(updates) => {
            // TODO: 保存更新到数据库
            console.log("保存结晶更新:", updates);
          }}
        />
      ) : selectedPoint ? (
        <NebulaDetailPanel
          point={selectedPoint}
          onClose={() => {
            setSelectedPoint(null);
            targetCameraRef.current = { x: 0, y: 0, zoom: 0.5 };
          }}
        />
      ) : null}

      {/* 项目侧边栏 */}
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={onSelectProject}
        projectPoints={projectPoints}
        onOpenTimeline={(projectId, points) => {
          const project = projects.find(p => p.id === projectId);
          if (project) {
            // 第一步：清除所有粒子的目标位置（让旧位置的粒子飞回原位）
            dataRef.current.points.forEach(pt => {
              delete pt.targetX;
              delete pt.targetY;
            });
            
            // 第二步：延迟一小段时间后，设置新项目的时间线
            setTimeout(() => {
              setTimelineProject({ id: projectId, name: project.name, points });
              setTimelineView("timeline");
              setShowProjectCard(false);
              
              const projectPoints = points;
              const count = projectPoints.length;
              const timelineLength = CONFIG.timelineHeight;
              const startY = -timelineLength / 2;
              
              targetCameraRef.current = {
                x: CONFIG.timelineXOffset,
                y: 0,
                zoom: 0.5,
              };
              
              projectPoints.forEach((p, idx) => {
                const actualPoint = dataRef.current.points.find(ap => ap.id === p.id);
                if (actualPoint) {
                  const ratio = count > 1 ? idx / (count - 1) : 0.5;
                  const baseY = startY + ratio * timelineLength;
                  
                  actualPoint.targetX = CONFIG.timelineXOffset;
                  actualPoint.targetY = baseY;
                  actualPoint.opacity = 1;
                  
                  actualPoint.flyInStartX = actualPoint.x;
                  actualPoint.flyInStartY = actualPoint.y;
                  actualPoint.flyInStartTime = Date.now();
                  actualPoint.flyInProgress = true;
                }
              });
            }, 150);
          }
        }}
      />
      
      {/* 时间线面板 */}
      {timelineProject && (
        <TimelinePanel
          projectName={timelineProject.name}
          onClose={() => {
            // 退出时间线模式，让所有粒子回到原位
            dataRef.current.points.forEach(p => {
              delete p.targetX;
              delete p.targetY;
            });
            setTimelineProject(null);
            setTimelineView("nebula");
            setShowProjectCard(false);
          }}
        />
      )}

      {/* 中央项目信息卡片 - 仅时间线视图显示，粒子汇聚完成后显示 */}
      {timelineProject && timelineView === "timeline" && showProjectCard && (
        <ProjectInfoCard
          projectName={timelineProject.name}
          projectDescription="这是项目的关键决策和进度追踪"
          decisions={[
            {
              id: "dec-1",
              title: "确定项目方向",
              description: "经过讨论，确定了以用户体验为核心的产品方向",
              date: "2024-01-15",
              impact: "high",
            },
            {
              id: "dec-2",
              title: "技术选型",
              description: "选择 Next.js 作为主要技术栈",
              date: "2024-02-20",
              impact: "medium",
            },
            {
              id: "dec-3",
              title: "设计系统建立",
              description: "建立了统一的设计语言和组件库",
              date: "2024-03-10",
              impact: "low",
            },
          ]}
          onDecisionClick={(decision) => {
            console.log("点击决策:", decision);
          }}
          onClose={() => {
            setTimelineProject(null);
            setTimelineView("nebula");
            setShowProjectCard(false);
          }}
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

// ============== 形状绘制函数 ==============

/**
 * 绘制结晶形状 - 统一使用径向渐变发光效果
 */
function drawCrystalShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: "cube" | "star" | "diamond" | "sphere",
  time: number
) {
  // 保存原始颜色
  const baseColor = ctx.fillStyle as string;
  
  // 创建发光渐变效果
  const glowRadius = size * 3;
  const gradient = ctx.createRadialGradient(
    x - glowRadius * 0.3, y - glowRadius * 0.3, 0,
    x, y, glowRadius
  );
  
  // 渐变颜色：从中心高光 → 主体颜色 → 边缘光晕
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.2, baseColor);
  gradient.addColorStop(0.5, hexToRgba(baseColor, 0.6));
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  
  // 脉冲效果
  const pulse = Math.sin(time * 0.002 + size * 5) * 0.15;
  
  ctx.save();
  ctx.fillStyle = gradient;
  
  switch (shape) {
    case "cube": {
      // 立方体 - 旋转的正方形 + 发光
      const rotation = time * 0.0004;
      const s = size * 1.8 * (1 + pulse);
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // 外发光
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 15;
      
      ctx.fillRect(-s / 2, -s / 2, s, s);
      
      // 内部高光
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(-s / 4, -s / 4, s / 2, s / 2);
      break;
    }
    
    case "diamond": {
      // 菱形 - 旋转45度的正方形 + 发光
      const rotation = time * 0.0003;
      const s = size * 2 * (1 + pulse);
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // 外发光
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, 0);
      ctx.lineTo(0, s / 2);
      ctx.lineTo(-s / 2, 0);
      ctx.closePath();
      ctx.fill();
      
      // 中心高光
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    
    case "star": {
      // 五角星 + 发光
      const spikes = 5;
      const outerRadius = size * 2 * (1 + pulse);
      const innerRadius = size * 1;
      const rotation = time * 0.0002;
      
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // 外发光
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 20;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      
      // 边框发光
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
    
    case "sphere":
    default: {
      // 球体 - 径向渐变圆形 + 发光
      const s = size * 2 * (1 + pulse);
      
      // 外发光
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 20;
      
      // 渐变球体
      const sphereGradient = ctx.createRadialGradient(
        x - s * 0.3, y - s * 0.3, 0,
        x, y, s
      );
      sphereGradient.addColorStop(0, "rgba(255,255,255,0.9)");
      sphereGradient.addColorStop(0.3, baseColor);
      sphereGradient.addColorStop(0.7, hexToRgba(baseColor, 0.7));
      sphereGradient.addColorStop(1, "rgba(0,0,0,0)");
      
      ctx.fillStyle = sphereGradient;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  
  ctx.restore();
}

// 辅助函数：HEX 转 RGBA
function hexToRgba(hex: string, alpha: number): string {
  // 处理简写 #FFF
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 绘制结晶与来源星尘的连接线
 */
function drawCrystalConnections(
  ctx: CanvasRenderingContext2D,
  points: NebulaPoint2D[],
  selectedPoint: NebulaPoint2D | null,
  time: number,
  cam: { zoom: number }
) {
  // 只有选中结晶时才绘制连接线
  if (!selectedPoint || selectedPoint.type !== "crystal" || !selectedPoint.sourceStardustIds?.length) {
    return;
  }

  const crystalId = selectedPoint.id;
  const crystalSourceIds = selectedPoint.sourceStardustIds;
  
  // 找到结晶和来源星尘的位置
  const crystal = points.find(p => p.id === crystalId);
  if (!crystal) return;
  
  // 计算结晶的漂浮位置
  const driftX = Math.sin(time * CONFIG.driftSpeed * 1000 + crystal.pulseOffset) * CONFIG.driftRadius;
  const driftY = Math.cos(time * CONFIG.driftSpeed * 800 + crystal.pulseOffset * 1.3) * CONFIG.driftRadius;
  const crystalX = crystal.x + driftX;
  const crystalY = crystal.y + driftY;
  
  // 收集来源星尘
  const sourceStardusts = points.filter(p => 
    crystalSourceIds.includes(p.id) && p.type === "dust"
  );
  
  if (sourceStardusts.length === 0) return;
  
  // 绘制连接线
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  sourceStardusts.forEach(stardust => {
    // 星尘的漂浮位置
    const sdDriftX = Math.sin(time * CONFIG.driftSpeed * 1000 + stardust.pulseOffset) * CONFIG.driftRadius;
    const sdDriftY = Math.cos(time * CONFIG.driftSpeed * 800 + stardust.pulseOffset * 1.3) * CONFIG.driftRadius;
    const sdX = stardust.x + sdDriftX;
    const sdY = stardust.y + sdDriftY;
    
    // 脉冲动画 - 线段从星尘向结晶流动
    const flowPhase = (time * 2 + stardust.pulseOffset) % 1;
    
    // 绘制渐变连线
    const gradient = ctx.createLinearGradient(sdX, sdY, crystalX, crystalY);
    gradient.addColorStop(0, hexToRgba(stardust.color, 0.05));
    gradient.addColorStop(0.5, hexToRgba(stardust.color, 0.2));
    gradient.addColorStop(1, hexToRgba(crystal.color, 0.4));
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 / cam.zoom; // 根据缩放调整线宽
    ctx.setLineDash([3, 3]);
    ctx.lineDashOffset = -flowPhase * 10; // 虚线动画
    
    ctx.beginPath();
    ctx.moveTo(sdX, sdY);
    ctx.lineTo(crystalX, crystalY);
    ctx.stroke();
    
    // 高亮来源星尘
    ctx.fillStyle = hexToRgba(stardust.color, 0.8);
    ctx.beginPath();
    ctx.arc(sdX, sdY, stardust.size * 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 绘制到结晶的光线
  ctx.globalAlpha = 0.3 + Math.sin(time * 3 + selectedPoint.pulseOffset) * 0.2;
  ctx.strokeStyle = hexToRgba(selectedPoint.color, 0.5);
  ctx.lineWidth = 2 / cam.zoom;
  ctx.setLineDash([]);
  
  sourceStardusts.forEach(stardust => {
    const sdDriftX = Math.sin(time * CONFIG.driftSpeed * 1000 + stardust.pulseOffset) * CONFIG.driftRadius;
    const sdDriftY = Math.cos(time * CONFIG.driftSpeed * 800 + stardust.pulseOffset * 1.3) * CONFIG.driftRadius;
    const sdX = stardust.x + sdDriftX;
    const sdY = stardust.y + sdDriftY;
    
    ctx.beginPath();
    ctx.moveTo(sdX, sdY);
    ctx.lineTo(crystalX, crystalY);
    ctx.stroke();
  });
  
  ctx.restore();
}

/**
 * 绘制星尘 - 小发光粒子
 */
function drawStardustParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  // 星尘就是简单的圆形粒子
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  points: NebulaPoint2D[],
  time: number,
  isSearching: boolean,
  selectedCrystal: NebulaPoint2D | null,
  timelineView: TimelineViewMode,
  timelineProjectId: string | null,
  searchHighlight: boolean = false,
  searchTime: number = 0
) {
  // 如果选中了结晶，重新布局来源星尘
  const crystalPos = selectedCrystal?.type === "crystal"
    ? { x: selectedCrystal.x, y: selectedCrystal.y }
    : null;
  const sourceIds = selectedCrystal?.sourceStardustIds || [];
  
  // 时间线视图：按时间排序的散点
  const timelinePoints = timelineView === "timeline" && timelineProjectId
    ? points
        .filter(p => p.projectIds.includes(timelineProjectId))
        .sort((a, b) => a.timestamp - b.timestamp)
    : null;

  // 时间线视图：计算时间密度分段
  const timelineDensityMap = new Map<number, number>(); // timestamp bucket -> count
  
  if (timelineView === "timeline" && timelinePoints) {
    // 将时间戳分成多个桶，计算每个桶的密度
    const bucketSize = 7 * 24 * 60 * 60 * 1000; // 一周为一个时间桶
    timelinePoints.forEach(p => {
      const bucket = Math.floor(p.timestamp / bucketSize);
      timelineDensityMap.set(bucket, (timelineDensityMap.get(bucket) || 0) + 1);
    });
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    // 时间线视图模式下：不属于当前项目的粒子直接隐藏
    if (timelineView === "timeline" && timelineProjectId) {
      if (!p.projectIds.includes(timelineProjectId)) {
        // 不属于当前项目的粒子直接隐藏
        p.opacity = 0;
        continue;
      }
    }

    // 退出时间线后：如果有 originX 但没有 targetX，触发飞回原位
    if (timelineView === "nebula" && p.originX !== undefined && p.targetX === undefined && p.flyInProgress === false) {
      p.flyInStartX = p.x;
      p.flyInStartY = p.y;
      p.targetX = p.originX;
      p.targetY = p.originY;
      p.flyInStartTime = Date.now();
      p.flyInProgress = true;
    }

    // 处理飞入动画（无论是飞向结晶还是飞回原位）
    if (p.flyInProgress && p.flyInStartTime && p.targetX !== undefined) {
      const elapsed = Date.now() - p.flyInStartTime;
      const duration = 1500; // 飞入时长 1.5 秒
      const progress = Math.min(elapsed / duration, 1);
      // 缓动函数：easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // 从起始位置飞向目标位置
      if (p.flyInStartX !== undefined && p.flyInStartY !== undefined && p.targetX !== undefined && p.targetY !== undefined) {
        p.x = p.flyInStartX + (p.targetX - p.flyInStartX) * easedProgress;
        p.y = p.flyInStartY + (p.targetY - p.flyInStartY) * easedProgress;
      }
      
      // 透明度随飞入渐变
      p.opacity = easedProgress;
      
      if (progress >= 1) {
        p.flyInProgress = false;
        // 到达目标位置，停止移动
        if (p.targetX !== undefined && p.targetY !== undefined) {
          p.x = p.targetX;
          p.y = p.targetY;
        }
        // 清除飞入相关属性
        delete p.flyInStartX;
        delete p.flyInStartY;
        delete p.flyInStartTime;
      }
    }
    // 选中结晶时：为相关散点设置目标位置（只在刚进入选中状态时设置一次）
    else if (crystalPos && p.type === "dust" && sourceIds.includes(p.id) && p.targetX === undefined) {
      // 设置结晶周围的目标位置
      const chars = p.id.split('');
      const angleHash = chars.reduce((acc, char, idx) => {
        return acc + (char.charCodeAt(0) - 97) * Math.pow(31, idx % 6);
      }, 0);
      const radiusHash = chars.reduce((acc, char, idx) => {
        return acc + (char.charCodeAt(0) + idx * 7) * Math.pow(17, idx % 5);
      }, 0);
      const perturbHash = chars.reduce((acc, char, idx) => {
        return acc + (char.charCodeAt(0) * idx * 13);
      }, 0);
      
      const angleNorm = (angleHash % 1000000) / 1000000;
      const radiusNorm = (radiusHash % 1000000) / 1000000;
      const perturbNorm = (perturbHash % 1000000) / 1000000;
      
      const baseAngle = angleNorm * Math.PI * 2;
      const anglePerturb = Math.sin(perturbNorm * Math.PI * 2) * 0.3;
      const angle = baseAngle + anglePerturb;
      
      const minRadius = 20;
      const maxRadius = 150;
      const randomRadius = minRadius + Math.sqrt(radiusNorm) * (maxRadius - minRadius);
      
      p.targetX = crystalPos.x + Math.cos(angle) * randomRadius;
      p.targetY = crystalPos.y + Math.sin(angle) * randomRadius;
    }
    // 时间线视图：为项目散点设置目标位置
    if (
      timelineView === "timeline" && 
      timelineProjectId && 
      p.projectIds.includes(timelineProjectId)
    ) {
      // 2D 垂直时间线布局
      
      if (p.targetX === undefined && !p.flyInProgress) {
        // 第一次进入时间线，设置目标位置
        const timelineX = CONFIG.timelineXOffset;
        const timelineLength = CONFIG.timelineHeight; // 固定 600px
        
        // 基于 timelinePoints 中的索引（已排序）
        const idx = timelinePoints!.indexOf(p);
        const count = timelinePoints!.length;
        
        // 按比例分配：从 -300 到 +300
        const ratio = count > 1 ? idx / (count - 1) : 0.5;
        const baseY = -timelineLength / 2 + ratio * timelineLength;
        
        if (p.type === "crystal") {
          // 结晶：稍微偏右
          p.targetX = timelineX + 15;
        } else {
          // 星尘：主线上的位置
          p.targetX = timelineX;
        }
        
        p.targetY = baseY;
      }
    }
    
    // 物理运动 - 选中结晶时跳过物理运动（散点静止）
    if (!selectedCrystal && !p.flyInProgress && p.targetX !== undefined && p.targetY !== undefined) {
      p.x += (p.targetX - p.x) * CONFIG.particleSpeed;
      p.y += (p.targetY - p.y) * CONFIG.particleSpeed;
      p.opacity += (p.targetOpacity - p.opacity) * CONFIG.particleSpeed;
    } else if (p.flyInProgress) {
      // 飞入动画期间，透明度由动画控制
    } else {
      // 选中结晶时，确保透明度正确
      p.opacity = p.targetOpacity;
    }
    
    if (p.opacity < 0.01) continue;
    
    // 漂浮效果 - 选中结晶时完全静止
    // 选中结晶时 driftSpeed 设为 0，完全静止
    // 时间线视图模式下使用轻微浮动效果
    const isTimelineMode = timelineView === "timeline" && timelineProjectId;
    const currentDriftSpeed = selectedCrystal ? 0 : (isTimelineMode ? CONFIG.timelineDriftSpeed : CONFIG.driftSpeed);
    const currentDriftRadius = selectedCrystal ? 0 : (isTimelineMode ? CONFIG.timelineDriftRadius : CONFIG.driftRadius);
    const driftX = Math.sin(time * currentDriftSpeed * 1000 + p.pulseOffset) * currentDriftRadius;
    const driftY = Math.cos(time * currentDriftSpeed * 800 + p.pulseOffset * 1.3) * currentDriftRadius;
    
    // 呼吸效果 - 大小和透明度同时呼吸
    const breathe = Math.sin(time * CONFIG.breatheSpeed * 1000 + p.pulseOffset) * CONFIG.breatheAmount;
    let size = p.size * (1 + breathe);
    let breatheOpacity = p.opacity * (1 + breathe * 0.3);
    
    ctx.globalAlpha = Math.min(1, breatheOpacity);
    
    // 搜索高亮：根据 searchType 设置不同颜色
    if (searchHighlight && searchTime > 0 && p.searchType !== undefined) {
      if (p.searchType === 2) {
        // 核心匹配：明亮的橙色
        ctx.fillStyle = "#ff4500";
        // 添加发光效果
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff4500";
      } else if (p.searchType === 1) {
        // 关联语义：明亮的青色
        ctx.fillStyle = "#00ff88";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ff88";
      } else {
        // 背景：暗淡的灰色
        ctx.fillStyle = "#333333";
        ctx.shadowBlur = 0;
      }
      // 增大匹配点的尺寸
      size *= 1.8;
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 0;
    }
    
    const drawX = p.x + driftX;
    const drawY = p.y + driftY;
    
    // 选中结晶时：结晶固定在中心，不要漂移
    // 确保结晶位置直接使用 p.x, p.y（目标位置）
    const crystalDrawX = (p.type === "crystal" && selectedCrystal) ? p.x : drawX;
    const crystalDrawY = (p.type === "crystal" && selectedCrystal) ? p.y : drawY;
    
    // 根据类型选择绘制方式
    if (p.type === "crystal" && p.shape) {
      // 结晶：绘制特定形状，放大显示
      drawCrystalShape(ctx, crystalDrawX, crystalDrawY, size * 1.1, p.shape, time);
    } else {
      // 星尘：简单圆形粒子
      drawStardustParticle(ctx, drawX, drawY, size, ctx.fillStyle as string);
    }
  }
}

function drawCategoryLabels(
  ctx: CanvasRenderingContext2D,
  categoryMeta: CategoryMeta[],
  cam: CameraState,
  timelineView: TimelineViewMode,
  compact: boolean = false
) {
  // 时间线模式下隐藏分类标签
  if (timelineView === "timeline") return;
  
  // 紧凑模式下隐藏分类标签
  if (compact) return;
  
  const catAlpha = Math.max(0, Math.min(1, (0.8 - cam.zoom) * 3));
  if (catAlpha < 0.01) return;
  
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 32px SourceHanSerifCN, serif"; // 紧凑模式调小
  
  categoryMeta.forEach((cat, idx) => {
    // 让分类标签缓慢旋转
    const rotation = Math.sin(Date.now() * 0.0003 + idx) * 0.02;
    
    ctx.save();
    ctx.globalAlpha = catAlpha * 0.4;
    ctx.fillStyle = cat.color;
    
    // 绘制带旋转的标签
    ctx.translate(cat.x, cat.y);
    ctx.rotate(rotation);
    ctx.fillText(cat.label, 0, 0);
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

// 绘制时间线轴和日期标注（仅在时间线视图模式下显示）
function drawTimelineAxis(
  ctx: CanvasRenderingContext2D,
  cam: CameraState,
  points: NebulaPoint2D[],
  timelineProjectId: string
) {
  const timelineX = CONFIG.timelineXOffset;
  const timelineLength = CONFIG.timelineHeight; // 固定长度 600px
  
  // 获取该项目按时间排序的所有点
  const projectPoints = points
    .filter(p => p.projectIds.includes(timelineProjectId))
    .sort((a, b) => a.timestamp - b.timestamp);
  
  if (projectPoints.length === 0) return;
  
  const pointCount = projectPoints.length;
  
  // 固定长度 600px，从 -300 到 +300
  const startY = -timelineLength / 2;
  const endY = timelineLength / 2;

  // 转换到屏幕坐标
  const screenTimelineX = (timelineX - cam.x) * cam.zoom + window.innerWidth / 2;
  const screenStartY = (startY - cam.y) * cam.zoom + window.innerHeight / 2;
  const screenEndY = (endY - cam.y) * cam.zoom + window.innerHeight / 2;

  ctx.save();
  
  // 按周分组，计算每个时段的节点密度
  const bucketSize = 7 * 24 * 60 * 60 * 1000;
  const bucketMap = new Map<number, { count: number; indices: number[]; points: NebulaPoint2D[] }>();
  
  projectPoints.forEach((p, idx) => {
    const bucket = Math.floor(p.timestamp / bucketSize);
    if (!bucketMap.has(bucket)) {
      bucketMap.set(bucket, { count: 0, indices: [], points: [] });
    }
    bucketMap.get(bucket)!.count++;
    bucketMap.get(bucket)!.indices.push(idx);
    bucketMap.get(bucket)!.points.push(p);
  });
  
  // 绘制动态粗细的时间线（根据节点密度调整）
  const sortedBuckets = Array.from(bucketMap.entries()).sort((a, b) => a[0] - b[0]);
  
  // 基础粗细和最大粗细（更明显的粗细变化）
  const minLineWidth = 3;
  const maxLineWidth = 20;
  
  // 计算全局最大密度用于归一化（使用对数缩放让差异更明显）
  const maxDensity = Math.max(...sortedBuckets.map(([_, data]) => data.count));
  const densityMultiplier = maxDensity > 5 ? 1.5 : 1; // 密度高时增强对比
  
  sortedBuckets.forEach(([bucket, data], bucketIdx) => {
    // 计算当前时段的线条粗细（使用非线性缩放，差异更明显）
    const densityRatio = data.count / maxDensity;
    // 使用平方根函数让差异更明显
    const lineWidth = minLineWidth + Math.pow(densityRatio, 0.6) * (maxLineWidth - minLineWidth);
    
    // 计算当前时段在时间线上的Y坐标范围（使用固定长度 600px）
    const minIdx = Math.min(...data.indices);
    const maxIdx = Math.max(...data.indices);
    const pointCount = projectPoints.length;
    const ratio1 = pointCount > 1 ? minIdx / (pointCount - 1) : 0;
    const ratio2 = pointCount > 1 ? maxIdx / (pointCount - 1) : 1;
    const y1 = startY + ratio1 * timelineLength;
    const y2 = startY + ratio2 * timelineLength;
    
    const screenY1 = (y1 - cam.y) * cam.zoom + window.innerHeight / 2;
    const screenY2 = (y2 - cam.y) * cam.zoom + window.innerHeight / 2;
    
    // 绘制该时段的时间线段（粗细根据密度变化）
    // 密集区域更粗更亮
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + densityRatio * 0.6})`;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(screenTimelineX, screenY1);
    ctx.lineTo(screenTimelineX, screenY2);
    ctx.stroke();
  });
  
  // 绘制日期标注（在时间线左侧）
  const dateLabelX = CONFIG.timelineDateLabelX;
  const screenDateX = (dateLabelX - cam.x) * cam.zoom + window.innerWidth / 2;
  
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = "bold 11px SourceHanSerifCN, serif";
  
  // 绘制关键词（在时间线右侧）
  ctx.textAlign = "left";
  ctx.font = "10px SourceHanSerifCN, serif";
  
  // 使用已有的 sortedBuckets 绘制日期标注和关键词
  sortedBuckets.forEach(([bucket, data]) => {
    // 计算该桶在时间线上的大致位置
    const avgIdx = data.indices.reduce((sum, idx) => sum + idx, 0) / data.indices.length;
    const pointCount = projectPoints.length;
    const avgRatio = pointCount > 1 ? avgIdx / (pointCount - 1) : 0.5;
    const bucketY = startY + avgRatio * timelineLength;
    const screenBucketY = (bucketY - cam.y) * cam.zoom + window.innerHeight / 2;
    
    // 格式化日期
    const date = new Date(bucket * bucketSize);
    const dateStr = date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    
    // 绘制日期标签
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText(dateStr, screenDateX - 10, screenBucketY);
    
    // 绘制连接线（从日期到时间线）
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenDateX, screenBucketY);
    ctx.lineTo(screenTimelineX, screenBucketY);
    ctx.stroke();
    
    // 在时间线上画小圆点
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.arc(screenTimelineX, screenBucketY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 关键词点亮效果 - 从该时段的点中提取关键词
    if (data.points.length > 0) {
      // 随机选择一个点来显示关键词
      const randomPoint = data.points[Math.floor(Math.random() * data.points.length)];
      const keywords = extractKeywords(randomPoint.content);
      
      if (keywords.length > 0) {
        const keyword = keywords[0];
        const keywordX = screenTimelineX + 15;
        
        // 绘制发光关键词
        ctx.save();
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(keyword, keywordX, screenBucketY);
        ctx.restore();
      }
    }
  });
  
  ctx.restore();
}

// 提取关键词函数
function extractKeywords(content: string): string[] {
  if (!content) return [];
  
  // 移除标点符号，按空格分词
  const words = content
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // 简单返回前3个词作为关键词
  return words.slice(0, 3);
}

// 悬停散点时显示其所属结晶名称（仅 Zoom Out 状态显示）
function drawStardustLabel(
  ctx: CanvasRenderingContext2D,
  point: NebulaPoint2D,
  cam: CameraState,
  crystalTitle: string,
  crystalColor: string
) {
  if (!crystalTitle) return;
  
  // 屏幕坐标
  const screenX = (point.x - cam.x) * cam.zoom + window.innerWidth / 2;
  const screenY = (point.y - cam.y) * cam.zoom + window.innerHeight / 2;
  
  // 在散点上方绘制标签
  const labelX = screenX;
  const labelY = screenY - 40 * cam.zoom;
  
  ctx.save();
  
  // 背景框
  ctx.font = `${12 * cam.zoom}px SourceHanSerifCN, serif`;
  const textWidth = ctx.measureText(crystalTitle).width;
  const padding = 8 * cam.zoom;
  const boxWidth = Math.max(textWidth + padding * 2, 120 * cam.zoom);
  const boxHeight = 24 * cam.zoom;
  
  // 半透明背景
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.beginPath();
  ctx.roundRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight, 4);
  ctx.fill();
  
  // 边框
  ctx.strokeStyle = crystalColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // 文字
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(crystalTitle, labelX, labelY);
  
  // 连接线
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(labelX, labelY + boxHeight / 2);
  ctx.strokeStyle = crystalColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  
  ctx.restore();
}

// ============== UI 组件 ==============

function NebulaHeader({
  isSearching,
  zoomLevel,
}: {
  isSearching: boolean;
  zoomLevel: ZoomLevel;
}) {
  return null;
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

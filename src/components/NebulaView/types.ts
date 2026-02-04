/**
 * 2D Canvas 星云渲染 - 类型定义
 * 
 * 用于 NebulaCanvas 组件的内部数据结构
 */

import type { NebulaPoint } from "@/lib/db/local-data";
import type { CategoryId } from "@/lib/categories";

/**
 * 2D 粒子点 - 用于 Canvas 渲染
 */
export interface NebulaPoint2D {
  // 基础属性 (从 NebulaPoint 复制)
  id: string;
  type: NebulaPoint["type"];
  content: string;
  title?: string;
  category: CategoryId;
  timestamp: number;
  importance: number;
  shape?: NebulaPoint["shape"];
  projectIds: string[];
  sourceStardustIds?: string[]; // 来源星尘 ID（仅结晶有）
  
  // 2D 渲染属性
  x: number;           // 当前 x 坐标
  y: number;           // 当前 y 坐标
  originX: number;     // 原始 x 坐标 (有机分布)
  originY: number;     // 原始 y 坐标 (有机分布)
  targetX?: number;     // 目标 x 坐标 (动画用)
  targetY?: number;     // 目标 y 坐标 (动画用)
  size: number;        // 粒子大小
  baseOpacity: number; // 基础透明度
  opacity: number;     // 当前透明度
  targetOpacity: number; // 目标透明度 (动画用)
  pulseOffset: number; // 脉冲动画偏移
  color: string;       // 类别颜色
  
  // 飞入动画属性
  flyInProgress?: boolean;  // 是否正在进行飞入动画
  flyInStartX?: number;     // 飞入起始 X 坐标
  flyInStartY?: number;     // 飞入起始 Y 坐标
  flyInStartTime?: number;  // 飞入开始时间
  
  // 搜索动画属性
  searchType?: number;      // 搜索类型: 0=背景, 1=关联语义, 2=核心匹配
  searchDelay?: number;    // 搜索延迟因子
}

/**
 * 话题簇 - 包含多个相关点
 */
export interface NebulaCluster {
  id: string;
  label: string;
  category: CategoryId;
  categoryLabel: string;
  color: string;
  x: number;
  y: number;
}

/**
 * 类别锚点元数据
 */
export interface CategoryMeta {
  id: CategoryId;
  label: string;
  color: string;
  x: number;
  y: number;
}

/**
 * 相机状态
 */
export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

/**
 * 目标相机状态
 */
export interface TargetCameraState {
  x: number;
  y: number;
  zoom: number;
}

/**
 * 鼠标状态
 */
export interface MouseState {
  isDown: boolean;
  lastX: number;
  lastY: number;
  lastClickX: number;
  lastClickY: number;
}

/**
 * 视图模式
 */
export type ZoomLevel = "Overview" | "Detailed";

/**
 * 时间线视图模式
 */
export type TimelineViewMode = "nebula" | "timeline";

/**
 * 时间线节点
 */
export interface TimelineNode {
  id: string;
  x: number;
  y: number;
  baseY: number;  // 基础 Y 坐标（时间轴位置）
  driftOffset: number; // 浮动偏移量
  timestamp: number;
  content: string;
  title?: string;
  category: string;
  color: string;
  importance: number;
}

/**
 * 渲染引擎配置
 */
export interface NebulaEngineConfig {
  pointCount: number;
  baseRadius: number;
  clusterRadius: number;
  zoomMin: number;
  zoomMax: number;
  zoomSpeed: number;
  lerpFactor: number;
  particleSpeed: number;
  searchClusterRadius: number;
  hitRadiusBase: number;
}

/**
 * 生成 2D 点数据的配置
 */
export interface PointGeneratorConfig {
  categoryCount: number;
  clustersPerCategory: number;
  pointsPerCluster: number;
  spreadBase: number;
  spreadVariance: number;
}

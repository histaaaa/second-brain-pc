/**
 * 9 大分类：色板与配置
 * 
 * 主题设计：鲜明对比色，每个分类有明显区分
 */
export const CATEGORIES = [
  { id: "DESIGN", label: "设计", color: "#3b82f6", glow: "#60a5fa" },          // 蓝色
  { id: "HCI", label: "交互", color: "#06b6d4", glow: "#22d3ee" },             // 青色
  { id: "RELATIONSHIPS", label: "关系", color: "#ec4899", glow: "#f472b6" },     // 粉色
  { id: "TRAVEL", label: "旅行", color: "#eab308", glow: "#facc15" },           // 黄色
  { id: "FINANCE", label: "理财", color: "#f59e0b", glow: "#fbbf24" },          // 金色
  { id: "WORK", label: "工作", color: "#8b5cf6", glow: "#a78bfa" },              // 紫色
  { id: "LEARNING", label: "学习", color: "#f97316", glow: "#fb923c" },          // 橙色
  { id: "ENTERTAINMENT", label: "娱乐", color: "#d946ef", glow: "#e879f9" },     // 洋红色
  { id: "HEALTH", label: "健康", color: "#22c55e", glow: "#4ade80" },            // 绿色
] as const;

// 旧类别到新类别的映射（兼容旧数据）
const CATEGORY_MAPPING: Record<string, string> = {
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

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getCategoryColor(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.color ?? "#94a3b8";
}

export function getCategoryGlow(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.glow ?? "#64748b";
}

/**
 * 获取点的颜色，支持旧类别自动映射到新类别
 */
export function getPointColor(category: string): string {
  // 尝试直接查找
  const directMatch = CATEGORIES.find((c) => c.id === category);
  if (directMatch) return directMatch.color;
  
  // 尝试映射查找
  const mappedId = CATEGORY_MAPPING[category];
  if (mappedId) {
    const mappedMatch = CATEGORIES.find((c) => c.id === mappedId);
    if (mappedMatch) return mappedMatch.color;
  }
  
  // 返回默认灰色
  return "#94a3b8";
}

/**
 * 9 大分类：色板与配置
 * 
 * 主题设计：
 * - DESIGN: 设计相关（UI/UX、视觉设计等）
 * - HCI: 人机交互（用户体验、交互设计等）
 * - RELATIONSHIPS: 人际关系（社交、沟通等）
 * - TRAVEL: 旅行（出行、景点、攻略等）
 * - FINANCE: 理财（投资、储蓄、消费等）
 * - WORK: 工作（职场、项目、会议等）
 * - LEARNING: 学习（读书、课程、技能等）
 * - ENTERTAINMENT: 娱乐（电影、游戏、音乐等）
 * - HEALTH: 健康（医疗、身体、心理等）
 */
export const CATEGORIES = [
  { id: "DESIGN", label: "设计", color: "#00ff88", glow: "#00ffaa" },          // 荧光绿
  { id: "HCI", label: "交互", color: "#00ccff", glow: "#00eeff" },             // 荧光蓝
  { id: "RELATIONSHIPS", label: "关系", color: "#ff66aa", glow: "#ff88cc" },   // 荧光粉
  { id: "TRAVEL", label: "旅行", color: "#ffcc00", glow: "#ffee33" },          // 荧光黄
  { id: "FINANCE", label: "理财", color: "#00ffcc", glow: "#00ffee" },         // 荧光青
  { id: "WORK", label: "工作", color: "#aa66ff", glow: "#cc88ff" },            // 荧光紫
  { id: "LEARNING", label: "学习", color: "#ff8800", glow: "#ffaa33" },        // 荧光橙
  { id: "ENTERTAINMENT", label: "娱乐", color: "#ff00ff", glow: "#ff44ff" },   // 荧光洋红
  { id: "HEALTH", label: "健康", color: "#00ff99", glow: "#00ffbb" },          // 荧光薄荷
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

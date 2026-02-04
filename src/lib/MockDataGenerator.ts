import type { CategoryId } from "./categories";

export type StardustType = "dust" | "crystal";
export type CrystalShape = "cube" | "star" | "diamond" | "sphere";

export interface Stardust {
  id: string;
  content: string;
  subLabel?: string;
  category: CategoryId;
  timestamp: Date;
  type: StardustType;
  shape?: CrystalShape;
  projectId?: string;
  importance: number;
}

const SUB_LABELS: Record<CategoryId, string[]> = {
  DESIGN: ["UI 设计", "UX 研究", "设计系统", "品牌设计", "插画"],
  HCI: ["交互设计", "可用性测试", "用户调研", "原型设计", "无障碍设计"],
  RELATIONSHIPS: ["家人联系", "朋友聚会", "社交活动", "人脉维护", "家庭聚餐"],
  TRAVEL: ["旅行计划", "出行攻略", "酒店预订", "景点推荐", "旅行笔记"],
  FINANCE: ["理财规划", "预算管理", "投资记录", "收入支出", "财务目标"],
  WORK: ["工作任务", "项目协作", "会议记录", "职业发展", "工作效率"],
  LEARNING: ["语言学习", "技能提升", "在线课程", "阅读笔记", "知识管理"],
  ENTERTAINMENT: ["影视娱乐", "游戏放松", "音乐欣赏", "艺术收藏", "休闲活动"],
  HEALTH: ["运动健身", "作息管理", "饮食健康", "心理健康", "日常习惯"],
};

const CONTENT_SAMPLES: Record<CategoryId, string[]> = {
  DESIGN: ["设计灵感", "UI 作品", "品牌方案", "设计思考", "创意草图"],
  HCI: ["用户研究", "交互方案", "可用性分析", "原型演示", "测试反馈"],
  RELATIONSHIPS: ["社交互动", "关系维护", "聚会记录", "人脉备注", "情感交流"],
  TRAVEL: ["旅行见闻", "行程安排", "目的地探索", "旅行心得", "出行计划"],
  FINANCE: ["财务记录", "投资分析", "预算执行", "理财心得", "消费回顾"],
  WORK: ["工作进展", "项目协作", "会议纪要", "任务管理", "工作总结"],
  LEARNING: ["学习笔记", "课程总结", "知识沉淀", "技能练习", "阅读感悟"],
  ENTERTAINMENT: ["观影感受", "游戏体验", "音乐分享", "艺术欣赏", "休闲活动"],
  HEALTH: ["运动记录", "作息追踪", "健康监测", "饮食日志", "身心状态"],
};

const PROJECT_IDS = ["project-a", "project-b", "project-c", "project-d", "project-e"];
const SHAPES: CrystalShape[] = ["cube", "star", "diamond", "sphere"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(yearBack: number): Date {
  const now = Date.now();
  const past = now - yearBack * 365 * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

export function generateStardust(count: number = 1000): Stardust[] {
  const categories: CategoryId[] = [
    "HEALTH", "DESIGN", "HCI", "TRAVEL", "FINANCE", "WORK", "LEARNING", "ENTERTAINMENT", "RELATIONSHIPS",
  ];
  const out: Stardust[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const category = pick(categories);
    const subLabels = SUB_LABELS[category];
    const contents = CONTENT_SAMPLES[category];
    const subLabel = subLabels.length ? pick(subLabels) : undefined;
    const content = contents.length
      ? pick(contents) + " · " + randomDate(2).toLocaleDateString("zh-CN")
      : "记忆片段 " + (i + 1);

    let id = `stardust-${category}-${i}-${Math.random().toString(36).slice(2, 8)}`;
    while (usedIds.has(id)) {
      id = `stardust-${category}-${i}-${Math.random().toString(36).slice(2, 8)}`;
    }
    usedIds.add(id);

    const type: StardustType = Math.random() < 0.3 ? "crystal" : "dust";
    const importance = 0.2 + Math.random() * 0.8;
    const projectId = Math.random() < 0.4 ? pick(PROJECT_IDS) : undefined;

    out.push({
      id,
      content,
      subLabel,
      category,
      timestamp: randomDate(2),
      type,
      shape: type === "crystal" ? pick(SHAPES) : undefined,
      projectId,
      importance,
    });
  }

  return out;
}

export const MOCK_STARDUST = generateStardust(1000);

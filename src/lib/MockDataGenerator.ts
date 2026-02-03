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
  GROWTH: ["意大利语", "荣格心理学", "睡眠", "阅读", "写作", "课程", "冥想"],
  FAMILY: ["奶奶电话", "远程问诊", "家庭聚餐", "生日", "纪念日"],
  CAREER: ["HKUST 申请", "AI 硬件", "设计评审", "人体工学", "会议纪要"],
  LEISURE: ["小屋 Alpha", "桌面布置", "咖啡", "画廊", "护照续签", "VR 游戏", "环境光", "素描", "科幻片"],
  SOCIAL: ["李教授", "团建", "Joe", "人脉", "聚会", "会议"],
  HEALTH: ["咖啡因记录", "家务", "生物钟", "日记", "冥想", "运动"],
  WEALTH: ["自由职业", "米兰预算", "报销", "奖学金", "理财"],
};

const CONTENT_SAMPLES: Record<CategoryId, string[]> = {
  GROWTH: ["今日学习笔记", "读书摘要", "课程心得", "反思记录", "技能练习"],
  FAMILY: ["与家人通话记录", "家庭事项", "健康随访", "节日安排"],
  CAREER: ["项目进展", "会议记录", "待办事项", "邮件摘要", "协作笔记"],
  LEISURE: ["观影记录", "游戏心得", "旅行计划", "爱好相关"],
  SOCIAL: ["社交活动记录", "人脉备注", "会议要点", "合作意向"],
  HEALTH: ["作息记录", "运动打卡", "饮食笔记", "情绪记录"],
  WEALTH: ["支出记录", "预算规划", "收入备注", "投资笔记"],
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
    "GROWTH", "FAMILY", "CAREER", "LEISURE", "SOCIAL", "HEALTH", "WEALTH",
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

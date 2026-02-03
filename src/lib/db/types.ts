import type { CategoryId } from "@/lib/categories";

/** 星尘：原始素材 */
export interface StardustRecord {
  id: string;
  content: string;
  title?: string;
  category: CategoryId;
  importance: number;
  created_at: number;
  updated_at: number;
  source_type?: "recording" | "manual";
  metadata?: Record<string, unknown>;
}

/** 结晶模板 ID */
export type CrystalTemplateId = "document" | "person_card" | "todo";

/** 结晶：结构化产出物 */
export interface CrystalRecord {
  id: string;
  template_id: CrystalTemplateId;
  payload: DocumentPayload | PersonCardPayload | TodoPayload;
  title: string;
  content?: string;
  category: CategoryId;
  importance: number;
  shape: "cube" | "star" | "diamond" | "sphere";
  created_at: number;
  updated_at: number;
  external_ref?: string;
}

export interface DocumentPayload {
  title: string;
  body?: string;
  sections?: { heading: string; content: string }[];
  summary?: string;
}

export interface PersonCardPayload {
  name: string;
  relationship: string;
  context?: string;
  notes?: string;
  tags?: string[];
}

export interface TodoPayload {
  title: string;
  status: "pending" | "done";
  due?: string;
  priority?: "low" | "medium" | "high";
}

/** 结晶–星尘来源 */
export interface CrystalSourceRecord {
  crystal_id: string;
  stardust_id: string;
  order?: number;
}

/** 项目 */
export interface ProjectRecord {
  id: string;
  name: string;
  created_at: number;
  metadata?: Record<string, unknown>;
}

/** 标签 */
export interface TagRecord {
  id: string;
  name: string;
  category?: CategoryId;
}

/** 多态：条目–项目 */
export type EntryType = "stardust" | "crystal";

export interface EntryProjectRecord {
  entry_type: EntryType;
  entry_id: string;
  project_id: string;
}

/** 多态：条目–标签 */
export interface EntryTagRecord {
  entry_type: EntryType;
  entry_id: string;
  tag_id: string;
}

/** 星云/时间线中的「点」：星尘或结晶的统一视图（供 3D 与列表用） */
export type NebulaPointType = "dust" | "crystal";

export interface NebulaPoint {
  id: string;
  type: NebulaPointType;
  content: string;
  title?: string;
  category: CategoryId;
  timestamp: number;
  importance: number;
  shape?: "cube" | "star" | "diamond" | "sphere";
  projectIds: string[];
}

import type { CategoryId } from "@/lib/categories";
import type {
  StardustRecord,
  CrystalRecord,
  DocumentPayload,
  PersonCardPayload,
  TodoPayload,
  NebulaPoint,
  EntryType,
  ProjectRecord,
  TagRecord,
} from "./types";
import { db } from "./schema";

const CATEGORIES: CategoryId[] = [
  "GROWTH", "FAMILY", "CAREER", "LEISURE", "SOCIAL", "HEALTH", "WEALTH",
];
const SHAPES: CrystalRecord["shape"][] = ["cube", "star", "diamond", "sphere"];

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function listProjects(): Promise<{ id: string; name: string }[]> {
  const rows = await db.projects.toArray();
  return rows.map((r) => ({ id: r.id, name: r.name }));
}

export async function getProjectIds(): Promise<string[]> {
  const rows = await db.projects.orderBy("id").toArray();
  return rows.map((r) => r.id);
}

async function getProjectIdsForEntry(entryType: EntryType, entryId: string): Promise<string[]> {
  const rows = await db.entry_projects
    .filter((ep) => ep.entry_type === entryType && ep.entry_id === entryId)
    .toArray();
  return rows.map((r) => r.project_id);
}

export async function listNebulaPoints(searchQuery?: string): Promise<NebulaPoint[]> {
  // 并行获取所有数据
  const [stardustList, crystalsList, allEntryProjects] = await Promise.all([
    db.stardust.orderBy("created_at").toArray(),
    db.crystals.orderBy("created_at").toArray(),
    db.entry_projects.toArray(),
  ]);

  // 创建 entry_id -> project_ids 的映射（一次性查询替代 N+1 查询）
  const entryToProjectsMap = new Map<string, string[]>();
  for (const ep of allEntryProjects) {
    const key = `${ep.entry_type}:${ep.entry_id}`;
    if (!entryToProjectsMap.has(key)) {
      entryToProjectsMap.set(key, []);
    }
    entryToProjectsMap.get(key)!.push(ep.project_id);
  }

  const points: NebulaPoint[] = [];
  const q = searchQuery?.trim().toLowerCase();

  for (const s of stardustList) {
    const key = `stardust:${s.id}`;
    const projectIds = entryToProjectsMap.get(key) || [];
    const content = s.content;
    const title = s.title;

    if (q && !content.toLowerCase().includes(q) && !(title && title.toLowerCase().includes(q))) {
      continue;
    }
    points.push({
      id: s.id,
      type: "dust",
      content,
      title,
      category: s.category,
      timestamp: s.created_at,
      importance: s.importance,
      projectIds,
    });
  }

  for (const c of crystalsList) {
    const key = `crystal:${c.id}`;
    const projectIds = entryToProjectsMap.get(key) || [];
    const content = c.content ?? c.title;
    const title = c.title;

    if (q && !content.toLowerCase().includes(q) && !title.toLowerCase().includes(q)) {
      continue;
    }
    points.push({
      id: c.id,
      type: "crystal",
      content,
      title,
      category: c.category,
      timestamp: c.created_at,
      importance: c.importance,
      shape: c.shape,
      projectIds,
    });
  }

  return points.sort((a, b) => a.timestamp - b.timestamp);
}

export async function getEntriesByProject(projectId: string): Promise<NebulaPoint[]> {
  const all = await listNebulaPoints();
  return all.filter((p) => p.projectIds.includes(projectId));
}

export async function getCrystalSources(crystalId: string): Promise<StardustRecord[]> {
  const links = await db.crystal_sources.where("crystal_id").equals(crystalId).toArray();
  if (links.length === 0) return [];
  const ids = links.map((l) => l.stardust_id);
  const stardust = await db.stardust.bulkGet(ids);
  return stardust.filter((s): s is StardustRecord => s != null);
}

export async function createCrystal(
  template_id: CrystalRecord["template_id"],
  payload: DocumentPayload | PersonCardPayload | TodoPayload,
  source_stardust_ids: string[],
  opts: { title: string; category: CategoryId; projectIds?: string[] }
): Promise<CrystalRecord> {
  const now = Date.now();
  const id = uuid();
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

  const record: CrystalRecord = {
    id,
    template_id,
    payload: payload as CrystalRecord["payload"],
    title: opts.title,
    content: typeof payload === "object" && "title" in payload ? payload.title : "",
    category: opts.category,
    importance: 0.6 + Math.random() * 0.4,
    shape,
    created_at: now,
    updated_at: now,
  };

  await db.crystals.add(record);

  for (let i = 0; i < source_stardust_ids.length; i++) {
    await db.crystal_sources.add({
      crystal_id: id,
      stardust_id: source_stardust_ids[i],
      order: i,
    });
  }

  if (opts.projectIds?.length) {
    for (const project_id of opts.projectIds) {
      await db.entry_projects.add({ entry_type: "crystal", entry_id: id, project_id });
    }
  }

  return record;
}

export async function seedProjects(records: ProjectRecord[]): Promise<void> {
  await db.projects.bulkAdd(records);
}

export async function seedStardust(records: StardustRecord[]): Promise<void> {
  await db.stardust.bulkAdd(records);
}

export async function linkEntryToProject(
  entryType: EntryType,
  entryId: string,
  projectId: string
): Promise<void> {
  await db.entry_projects.add({ entry_type: entryType, entry_id: entryId, project_id: projectId });
}

export async function seedEntryProjects(entries: { entry_type: EntryType; entry_id: string; project_id: string }[]): Promise<void> {
  await db.entry_projects.bulkAdd(entries);
}

export async function seedTags(records: TagRecord[]): Promise<void> {
  await db.tags.bulkAdd(records);
}

export async function seedEntryTags(entries: { entry_type: EntryType; entry_id: string; tag_id: string }[]): Promise<void> {
  await db.entry_tags.bulkAdd(entries);
}

export async function isSeeded(): Promise<boolean> {
  const count = await db.stardust.count();
  return count >= 500;
}

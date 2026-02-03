// 种子数据 JSON 模块的类型声明
// 这个文件告诉 TypeScript seed-data.json 可能存在（由预生成脚本生成）

declare module "./seed-data/seed-data.json" {
  const content: {
    data: {
      projects: import("@/lib/db/types").ProjectRecord[];
      stardust: import("@/lib/db/types").StardustRecord[];
      crystalSources?: { crystal_id: string; stardust_id: string; order: number }[];
      entryProjects?: { entry_type: "stardust" | "crystal"; entry_id: string; project_id: string }[];
    };
  };
  export default content;
}

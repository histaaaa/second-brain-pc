import Dexie, { type Table } from "dexie";
import type {
  StardustRecord,
  CrystalRecord,
  CrystalSourceRecord,
  ProjectRecord,
  TagRecord,
  EntryProjectRecord,
  EntryTagRecord,
} from "./types";

export class SecondBrainDB extends Dexie {
  stardust!: Table<StardustRecord, string>;
  crystals!: Table<CrystalRecord, string>;
  crystal_sources!: Table<CrystalSourceRecord, [string, string]>;
  projects!: Table<ProjectRecord, string>;
  tags!: Table<TagRecord, string>;
  entry_projects!: Table<EntryProjectRecord, [string, string, string]>;
  entry_tags!: Table<EntryTagRecord, [string, string, string]>;

  constructor() {
    super("SecondBrainDB");
    this.version(1).stores({
      stardust: "id, category, created_at",
      crystals: "id, template_id, category, created_at",
      crystal_sources: "[crystal_id+stardust_id], crystal_id, stardust_id",
      projects: "id",
      tags: "id",
      entry_projects: "[entry_type+entry_id+project_id], entry_type, entry_id, project_id",
      entry_tags: "[entry_type+entry_id+tag_id], entry_type, entry_id, tag_id",
    });
  }
}

export const db = new SecondBrainDB();

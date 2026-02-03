"use client";

import { useState, useCallback, useEffect } from "react";
import {
  loadDatabaseData, 
  stardustsToNebulaPoints, 
  filterByProject,
  type NebulaPoint 
} from "@/lib/db/local-data";
import { NebulaCanvas } from "./NebulaCanvas";
import { ProjectStack } from "./ProjectStack";
import { ViewModeToggle } from "./ViewModeToggle";
import { ArchiveMode } from "./ArchiveMode";

type ViewMode = "nebula" | "archive";

export default function NebulaView() {
  const [viewMode, setViewMode] = useState<ViewMode>("nebula");
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [allPoints, setAllPoints] = useState<NebulaPoint[]>([]);
  const [points, setPoints] = useState<NebulaPoint[]>([]);
  const [projectPoints, setProjectPoints] = useState<NebulaPoint[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrystalId, setSelectedCrystalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 从 database 文件夹加载真实数据
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { projects: projList, stardusts } = await loadDatabaseData();
        
      if (cancelled) return;
        
        // 转换为 NebulaPoint 格式
        const nebulaPoints = stardustsToNebulaPoints(stardusts);
        
        setProjects(projList.map(p => ({ id: p.id, name: p.name })));
        setAllPoints(nebulaPoints);
        setPoints(nebulaPoints);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load database:", error);
      setLoading(false);
      }
    })();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPoints(allPoints);
      return;
    }
    
    const filtered = allPoints.filter(p => 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPoints(filtered);
  }, [searchQuery, allPoints]);

  // 项目筛选
  useEffect(() => {
    if (!activeProjectId) {
      setProjectPoints([]);
      return;
    }
    
    const filtered = filterByProject(points, activeProjectId);
    setProjectPoints(filtered);
  }, [activeProjectId, points]);

  const onReset = useCallback(() => {
    setActiveProjectId(null);
    setSearchQuery("");
    setSelectedCrystalId(null);
  }, []);

  const onSelectPoint = useCallback((point: NebulaPoint) => {
    if (point.type === "crystal") setSelectedCrystalId(point.id);
  }, []);

  // Archive Mode 关闭时重置状态
  const onArchiveClose = useCallback(() => {
    setViewMode("nebula");
  }, []);

  return (
    <div className="relative w-full h-full bg-void">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-void z-20">
          <span className="text-white/60 animate-pulse">加载星云数据...</span>
        </div>
      ) : null}

      {/* 视图模式切换按钮 */}
      <ViewModeToggle mode={viewMode} onChange={setViewMode} />

      {/* Archive Mode - 三栏式布局 */}
      {viewMode === "archive" && (
        <ArchiveMode 
          onClose={onArchiveClose} 
          points={allPoints}
          projects={projects}
        />
      )}

      {/* Nebula Mode - Canvas 2D 星云视图 */}
      {viewMode === "nebula" && (
        <NebulaCanvas
          points={points}
          projectPoints={projectPoints}
          projects={projects}
          activeProjectId={activeProjectId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectProject={setActiveProjectId}
          onSelectPoint={onSelectPoint}
        />
      )}
    </div>
  );
}

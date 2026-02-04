"use client";

import { useState } from "react";
import type { NebulaPoint } from "@/lib/db/local-data";

interface Project {
  id: string;
  name: string;
}

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  projectPoints: NebulaPoint[];
  onOpenTimeline: (projectId: string, points: NebulaPoint[]) => void;
}

export function ProjectSidebar({
  projects,
  activeProjectId,
  onSelectProject,
  projectPoints,
  onOpenTimeline,
}: ProjectSidebarProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
      <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1 text-left">
        Projects
      </h3>
      
      {projects.map((project) => {
        const isActive = activeProjectId === project.id;
        const isHovered = hoveredProject === project.id;
        
        return (
          <button
            key={project.id}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => {
              if (isActive) {
                onSelectProject(null);
              } else {
                onSelectProject(project.id);
                onOpenTimeline(project.id, projectPoints);
              }
            }}
            className={`
              relative w-auto min-w-[120px] px-3 py-2 rounded-lg text-left
              transition-all duration-300 ease-out
              ${isActive 
                ? "bg-white/15 shadow-lg shadow-white/5" 
                : "bg-white/5 hover:bg-white/10"
              }
            `}
            title={project.name}
          >
            {/* 完整项目名称 */}
            <span className="text-xs font-medium text-white/80 block truncate">
              {project.name}
            </span>
            
            {/* 点计数 */}
            <span className="text-[9px] text-gray-500">
              {projectPoints.length} points
            </span>
            
            {/* 活跃状态指示器 */}
            {isActive && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}

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
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-auto">
      <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1 text-center">
        Projects
      </h3>
      
      {projects.map((project) => {
        const isActive = activeProjectId === project.id;
        const isHovered = hoveredProject === project.id;
        const hasPoints = projectPoints.length > 0;
        
        return (
          <div key={project.id} className="relative group">
            {/* 悬停时显示的点计数 */}
            {isHovered && hasPoints && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-gray-400 whitespace-nowrap">
                {projectPoints.length} points
              </div>
            )}
            
            <button
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => {
                if (isActive) {
                  onSelectProject(null);
                } else {
                  onSelectProject(project.id);
                }
              }}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-300 ease-out
                ${isActive 
                  ? "bg-white/15 shadow-lg shadow-white/5 scale-110" 
                  : "bg-white/5 hover:bg-white/10 hover:scale-105"
                }
              `}
              title={project.name}
            >
              {/* 项目图标/首字母 */}
              <span className="text-xs font-bold text-white/80">
                {project.name.charAt(0).toUpperCase()}
              </span>
              
              {/* 活跃状态指示器 */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />
              )}
            </button>
            
            {/* 项目名称标签 */}
            <div className={`
              absolute right-full mr-3 top-1/2 -translate-y-1/2
              px-2.5 py-1 rounded-lg bg-white/5 backdrop-blur-sm
              text-[10px] font-medium text-white/70 whitespace-nowrap
              transition-all duration-200 pointer-events-auto
              ${isActive || isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"}
            `}>
              {project.name}
              
              {/* 展开时间线按钮 */}
              {isActive && projectPoints.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTimeline(project.id, projectPoints);
                  }}
                  className="ml-2 text-[9px] text-gray-500 hover:text-white/80 transition-colors"
                >
                  [Timeline]
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

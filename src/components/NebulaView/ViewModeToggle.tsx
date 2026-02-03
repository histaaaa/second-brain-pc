"use client";

import { useState } from "react";
import { Layout, Grid3X3, Sparkles } from "lucide-react";

type ViewMode = "nebula" | "archive";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="absolute top-6 right-6 z-20 flex items-center gap-2 glass rounded-full px-3 py-2">
      <button
        onClick={() => onChange("nebula")}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-200
          ${mode === "nebula"
            ? "bg-white/15 text-white"
            : "text-white/50 hover:text-white hover:bg-white/5"
          }
        `}
        title="星云视图"
      >
        <Sparkles size={14} />
        <span className="hidden sm:inline">星云</span>
      </button>

      <div className="w-px h-4 bg-white/10" />

      <button
        onClick={() => onChange("archive")}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-200
          ${mode === "archive"
            ? "bg-white/15 text-white"
            : "text-white/50 hover:text-white hover:bg-white/5"
          }
        `}
        title="归档视图"
      >
        <Layout size={14} />
        <span className="hidden sm:inline">归档</span>
      </button>
    </div>
  );
}

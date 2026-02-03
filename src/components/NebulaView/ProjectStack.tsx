"use client";

interface ProjectStackProps {
  projects: { id: string; name: string }[];
  activeProjectId: string | null;
  onSelect: (id: string | null) => void;
}

export function ProjectStack({
  projects,
  activeProjectId,
  onSelect,
}: ProjectStackProps) {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
      <span className="text-white/40 text-xs uppercase tracking-wider mb-1">
        项目堆栈
      </span>
      {projects.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(activeProjectId === p.id ? null : p.id)}
          className={`
            px-4 py-2.5 rounded-lg text-left text-sm font-medium
            transition-all duration-200
            ${
              activeProjectId === p.id
                ? "bg-white/15 text-white border border-white/20"
                : "glass text-white/80 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

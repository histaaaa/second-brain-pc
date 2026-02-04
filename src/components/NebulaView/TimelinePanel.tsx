"use client";

interface TimelinePanelProps {
  projectName: string;
  onClose: () => void;
}

export function TimelinePanel({
  projectName,
  onClose,
}: TimelinePanelProps) {
  return (
    <div className="absolute right-6 top-4 w-48 bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-xl z-40 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white/80">{projectName}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-gray-500 text-sm">
            close
          </span>
        </button>
      </div>
    </div>
  );
}

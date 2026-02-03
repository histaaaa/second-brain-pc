"use client";

interface SpotlightSearchProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function SpotlightSearch({ value, onChange, onReset }: SpotlightSearchProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
      <div className="glass rounded-full px-5 py-3 flex items-center gap-3 min-w-[320px] shadow-xl">
        <span className="text-white/50" aria-hidden>
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search memories..."
          className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="glass rounded-full px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        RESET
      </button>
    </div>
  );
}

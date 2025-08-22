"use client";

export default function ProgressPill({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / Math.max(1, total)) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-28 h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full bg-theme" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-neutral-700">
        {current}/{total}
      </span>
    </div>
  );
}

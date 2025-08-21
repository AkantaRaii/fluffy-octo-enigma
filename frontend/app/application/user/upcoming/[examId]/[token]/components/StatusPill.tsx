"use client";

export default function StatusPill({ started, block }: { started: boolean; block?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-1.5 text-sm ${
        block ? "w-full text-center" : ""
      } border-neutral-200 text-neutral-800`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full mr-2 ${
          started ? "bg-accent" : "bg-neutral-300"
        }`}
      />
      {started ? "In Progress" : "Not Started"}
    </div>
  );
}

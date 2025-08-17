"use client";
import { useState, FormEvent } from "react";
import { Department } from "@/types/Depertment";
import { Exam } from "@/types/Exam";

interface ExamFormProps {
  initialData?: Partial<Exam>;
  departments: Department[];
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
}

export default function ExamForm({
  initialData = {},
  departments,
  onSubmit,
  onCancel,
}: ExamFormProps) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [duration, setDuration] = useState(initialData.duration_minutes ?? 60);
  const [start, setStart] = useState(initialData.scheduled_start ?? "");
  const [end, setEnd] = useState(initialData.scheduled_end ?? "");
  const [department, setDepartment] = useState<number | null>(
    initialData.department ?? null
  );
  const [repeatAfterDays, setRepeatAfterDays] = useState<string | null>(
    initialData.repeat_after_days?.toString() ?? null
  );
  const [instruction, setInstruction] = useState(initialData.instructions ?? "");
  const [passingScore, setPassingScore] = useState(
    initialData.passing_score ?? 60
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      duration_minutes: duration,
      scheduled_start: start,
      scheduled_end: end,
      department,
      repeat_after_days: repeatAfterDays ? Number(repeatAfterDays) : null,
      instructions: instruction,
      passing_score: passingScore,
    };
    await onSubmit(payload);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Exam Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Exam Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          value={department ?? ""}
          onChange={(e) =>
            setDepartment(e.target.value ? parseInt(e.target.value) : null)
          }
          className="mt-1 w-full border border-gray-300 rounded-lg p-2 bg-white"
        >
          <option value="" disabled>
            Select a department
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          type="number"
          min="1"
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Start / End */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scheduled Start
        </label>
        <input
          value={start}
          onChange={(e) => setStart(e.target.value)}
          type="datetime-local"
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scheduled End
        </label>
        <input
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          type="datetime-local"
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Repeat After Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Repeat After Days (optional)
        </label>
        <input
          type="number"
          min="1"
          value={repeatAfterDays ?? ""}
          onChange={(e) => setRepeatAfterDays(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Passing Score */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Passing Score (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={passingScore}
          onChange={(e) => setPassingScore(parseInt(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          rows={4}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

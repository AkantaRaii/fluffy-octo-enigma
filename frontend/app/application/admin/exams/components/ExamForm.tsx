"use client";
import { useState, FormEvent } from "react";
import { Department } from "@/types/Depertment";
import { Exam } from "@/types/Exam";
import { toLocalInputValue } from "@/utils/date";

interface ExamFormProps {
  initialData?: Partial<Exam>;
  departments: Department[];
  onSubmit: (
    payload: any,
    options?: { addAllQuestions: boolean; addAllUsers: boolean }
  ) => Promise<void>;
  onCancel: () => void;
  isAdd?: boolean;
}

export default function ExamForm({
  initialData = {},
  departments,
  onSubmit,
  onCancel,
  isAdd,
}: ExamFormProps) {
  console.log(initialData);
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
  const [instruction, setInstruction] = useState(
    initialData.instructions ?? ""
  );
  const [passingScore, setPassingScore] = useState(
    initialData.passing_score ?? 60
  );

  const [addAllQuestions, setAddAllQuestions] = useState(false);
  const [addAllUsers, setAddAllUsers] = useState(true);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      duration_minutes: duration,
      scheduled_start: start,
      scheduled_end: end,
      department: department,
      repeat_after_days: repeatAfterDays ? Number(repeatAfterDays) : null,
      instructions: instruction,
      passing_score: passingScore,
    };

    await onSubmit(payload, { addAllQuestions, addAllUsers });
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
          value={toLocalInputValue(start)}
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
          value={toLocalInputValue(end)}
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
      {isAdd && (
        <>
          {/* checkbox for add all questions */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addAllQuestions"
              checked={addAllQuestions}
              onChange={(e) => setAddAllQuestions(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="addAllQuestions" className="text-sm text-gray-700">
              Include all <span className="text-theme">Questions</span> from
              this selected department to this{" "}
              <span className="text-theme">Exam</span>.
            </label>
          </div>
          {/* checkbox for add all users */}
          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addAllUsers"
              checked={addAllUsers}
              onChange={(e) => setAddAllUsers(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="addAllUsers" className="text-sm text-gray-700">
              Include all <span className="text-theme">Users</span> from
              selected department to this{" "}
              <span className="text-theme">Exam</span>.
            </label>
          </div> */}
        </>
      )}
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

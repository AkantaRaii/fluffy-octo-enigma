"use client";
import { useState, FormEvent } from "react";
import { Department } from "@/types/Depertment";
import { Option } from "@/types/QuestionOption";

export interface NewOption {
  text: string;
  is_correct: boolean; // always boolean in form state
}

interface QuestionFormProps {
  initialData?: any;
  departments: Department[];
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
}

export default function QuestionForm({
  initialData = {},
  departments,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [text, setText] = useState(initialData.text ?? "");
  const [marks, setMarks] = useState(initialData.marks ?? 1);
  const [department, setDepartment] = useState<number | null>(
    initialData.departments?.[0] ?? null
  );
  const [type, setType] = useState(initialData.type ?? "MCQ_SINGLE");

  // Convert existing options to NewOption[] if editing
  const [options, setOptions] = useState<NewOption[]>(
    initialData.options
      ? (initialData.options as Option[]).map((opt) => ({
          text: opt.text,
          is_correct: !!opt.is_correct,
        }))
      : [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ]
  );

  // Handle changes in options
  function handleOptionChange<K extends keyof NewOption>(
    index: number,
    key: K,
    value: NewOption[K]
  ) {
    const updated = [...options];

    if (key === "is_correct" && type === "MCQ_SINGLE") {
      // only one correct allowed
      updated.forEach((opt, i) => {
        updated[i].is_correct = i === index ? (value as boolean) : false;
      });
    } else {
      updated[index][key] = value;
    }

    setOptions(updated);
  }

  function addOption() {
    setOptions([...options, { text: "", is_correct: false }]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      departments: department ? [department] : [],
      text,
      marks,
      type,
      options: options.map((opt) => ({
        text: opt.text,
        is_correct:
          type === "MCQ_SINGLE" ? opt.is_correct : opt.is_correct ? 1 : 0,
      })),
    };
    await onSubmit(payload);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Text
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
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

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2 bg-white"
        >
          <option value="MCQ_SINGLE">MCQ - Single Answer</option>
          <option value="MCQ_MULTI">MCQ - Multiple Answers</option>
        </select>
      </div>

      {/* Marks */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Marks</label>
        <input
          type="number"
          min="1"
          value={marks}
          onChange={(e) => setMarks(parseInt(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2"
              placeholder={`Option ${idx + 1}`}
            />
            <input
              type={type === "MCQ_SINGLE" ? "radio" : "checkbox"}
              name="is_correct"
              checked={opt.is_correct}
              onChange={(e) =>
                handleOptionChange(idx, "is_correct", e.target.checked)
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-blue-600 text-sm"
        >
          + Add Option
        </button>
      </div>

      {/* Actions */}
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

"use client";
import { useState } from "react";
import { Department } from "@/types/Depertment";
import { Exam } from "@/types/Exam";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { fetchClient } from "@/utils/fetchClient";
import apiClient from "@/utils/axiosClient";
import { formatISO } from "date-fns";

interface Props {
  setAddExamForm: (value: boolean) => void;
  setExams: Dispatch<SetStateAction<Exam[]>>;
  departments: Department[];
}

export default function AddExam({
  setAddExamForm,
  setExams,
  departments,
}: Props) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [start, setStart] = useState("");
  const [department, setDepartment] = useState<number | null>(null);
  const [end, setEnd] = useState("");
  const [repeatAfterDays, setRepeatAfterDays] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title,
      duration_minutes: duration,
      scheduled_start: start,
      scheduled_end: end,
      department: department,
      repeat_after_days: repeatAfterDays ? Number(repeatAfterDays) : null,
      instructions: instruction,
      passing_score: passingScore,
    };
    console.log(payload);
    try {
      const res = await apiClient.post("/api/v1/exams/exams/", payload);
      setExams((prev) => [...prev, res.data]);
      setAddExamForm(false); // close drawer // close drawer
    } catch (error) {
      console.error("Failed to save exam:", error);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setAddExamForm(false)}
      ></div>

      <div className="fixed right-0 top-0 w-full max-w-md bg-cleanWhite h-full shadow-lg z-50 animate-slideIn flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-cleanWhite z-10">
          <h2 className="text-md font-semibold text-primaryText">Add Exam</h2>
          <button
            onClick={() => setAddExamForm(false)}
            className="p-2 rounded-md bg-gray-500"
          >
            <X className="text-white" width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
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
                placeholder="Exam Name"
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
                  setDepartment(
                    e.target.value ? parseInt(e.target.value) : null
                  )
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

            {/* Scheduled Start */}
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

            {/* Scheduled End */}
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
                placeholder="Leave blank for one-time exam"
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
                placeholder="Provide any specific instructions..."
              ></textarea>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// interface Props {
//   setAddExamForm: (value: boolean) => void;
//   setExams: Dispatch<SetStateAction<Exam[]>>;
//   departments: Department[];
// }
// import ExamForm from "./ExamForm";
// // import apiClient from "@/utils/axiosClient";

// export default function AddExam({
//   setAddExamForm,
//   setExams,
//   departments,
// }: Props) {
//   async function handleAdd(payload: any) {
//     const res = await apiClient.post("/api/v1/exams/exams/", payload);
//     setExams((prev) => [...prev, res.data]);
//     setAddExamForm(false);
//   }

//   return (
//     <ExamForm
//       departments={departments}
//       onSubmit={handleAdd}
//       onCancel={() => setAddExamForm(false)}
//     />
//   );
// }

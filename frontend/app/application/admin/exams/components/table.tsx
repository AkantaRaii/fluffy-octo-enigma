import React from "react";
import { Exam } from "@/types/Exam";
import { format } from "date-fns";
import { useModal } from "@/context/ModalContext";
import apiClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import { FilePenLine, Trash } from "lucide-react";
interface TableProps {
  data: Exam[];
  setEditExamForm: (value: boolean) => void;
  setCurrentExam: (value: Exam) => void;
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
}

export default function Table({
  data,
  setEditExamForm,
  setCurrentExam,
  setExams,
}: TableProps) {
  const router = useRouter();
  const { showModal } = useModal();
  const handleDelete = async (row: Exam) => {
    try {
      await apiClient.delete(`/api/v1/exams/exams/${row.id}/`);
      setExams((prev) => prev.filter((exam) => exam.id !== row.id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  return (
    <div className="overflow-x-auto border-gray-200 border-1 rounded-xl">
      <table className="min-w-full border-collapse">
        <thead className="rounded-t-xl">
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700 ">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Starts On</th>
            <th className="py-3 px-4">On Repeat</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Created By</th>
            <th className="py-3 px-4">Passing Marks</th>
            <th className="py-3 px-4">Action</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row) => (
            <tr
              onClick={() => router.push(`/application/admin/exams/${row.id}`)}
              key={row.id}
              className="border-b border-gray-300 last:border-b-0 hover:bg-gray-200 hover:cursor-pointer transition "
            >
              <td className="py-3 px-4">{row.title}</td>
              <td className="py-3 px-4">{row.department_name}</td>
              <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                <span className="font-medium text-gray-900">
                  {format(new Date(row.scheduled_start), "MMM dd, yyyy")}
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  {format(new Date(row.scheduled_start), "hh:mm a")}
                </span>
              </td>
              <td className="py-3 px-4">
                {row.repeat_after_days != null ? (
                  <>
                    Repeats every <br />
                    {row.repeat_after_days} days
                  </>
                ) : (
                  "Once"
                )}
              </td>

              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.is_active ? "UpComming" : "Passed"}
                </span>
              </td>
              <td className="py-3 px-4">{row.creator_email}</td>
              <td className="py-3 px-4">{row.passing_score}</td>
              <td className="py-3 px-4 text-gray-500 cursor-pointer">
                <div className="flex flex-row gap-2">
                  <div
                    title="Edit Exam"
                    className="hover:cursor-pointer text-theme hover:bg-white hover:text-midTheme text-center rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditExamForm(true);
                      setCurrentExam(row);
                    }}
                  >
                    <FilePenLine width={18} height={18} />
                  </div>
                  <div
                    title="Delete Exam"
                    className=" hover:cursor-pointer text-red-500 hover:bg-white hover:text-red-600 text-center rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      showModal(() => handleDelete(row), {
                        title: "Delete Confirmation",
                        message: "Are you sure you want to delete this item?",
                        confirmLabel: "Delete",
                      });
                    }}
                  >
                    <Trash width={18} height={18} />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-500 cursor-pointer">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

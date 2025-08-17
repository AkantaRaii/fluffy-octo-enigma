import React from "react";
import { Exam } from "@/types/Exam";
import { format } from "date-fns";
interface TableProps {
  data: Exam[];
}

export default function Table({ data }: TableProps) {
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
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition "
            >
              <td className="py-3 px-4">{row.title}</td>
              <td className="py-3 px-4">{row.department_name}</td>
              <td className="py-3 px-4">
                {format(new Date(row.scheduled_start), "yyyy-MM-dd HH:mm")}
              </td>
              <td className="py-3 px-4">
                {row.repeat_after_days != null
                  ? `Repeats after${row.repeat_after_days}`
                  : "Once"}
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
              <td className="py-3 px-4 text-gray-500 cursor-pointer">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

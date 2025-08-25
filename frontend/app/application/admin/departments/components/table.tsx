"use client";
import React from "react";
import { Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
export interface Department {
  id: number;
  name: string;
  description: string;
}

interface TableProps {
  data: Department[];
  // onUsersClick?: (departmentId: number) => void;
  // onExamsClick?: (departmentId: number) => void;
}

export default function DepartmentTable({
  data,
}: // onUsersClick,
// onExamsClick,
TableProps) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700">
          {data.map((dept) => (
            <tr
              key={dept.id}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-200 transition hover:cursor-pointer"
              onClick={() =>
                router.push(`/application/admin/departments/users/${dept.id}`)
              }
            >
              {/* ID */}
              <td className="py-3 px-4 font-medium">{dept.id}</td>

              {/* Name */}
              <td className="py-3 px-4">{dept.name}</td>

              {/* Description */}
              <td className="py-3 px-4">{dept.description}</td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {/* Users */}
                  <button
                    title="View Users"
                    className="p-2 rounded-full hover:bg-white transition hover:scale-110 hover:cursor-pointer "
                    // onClick={() => onUsersClick?.(dept.id)}
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                  </button>

                  {/* Exams */}
                  <button
                    title="View Exams"
                    className="p-2 rounded-full hover:bg-white transition hover:scale-105 hover:cursor-pointer"
                    // onClick={() => onExamsClick?.(dept.id)}
                  >
                    <FileText className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

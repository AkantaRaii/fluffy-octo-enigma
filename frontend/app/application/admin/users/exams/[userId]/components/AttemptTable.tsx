"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Exam {
  id: number;
  title: string;
  passing_score: number;
}

interface Attempt {
  id: number;
  user: User;
  exam: Exam;
  status: "failed" | "passed" | "not_attempted";
  score: number;
  is_submitted: boolean;
}

interface TableProps {
  data: Attempt[];
}

export default function AttemptTable({ data }: TableProps) {
  const router = useRouter();

  const formatStatus = (status: string) =>
    status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
            <th className="py-3 px-4 text-center">Exam Title</th>
            <th className="py-3 px-4 text-center">User</th>
            <th className="py-3 px-4 text-center">Score</th>
            <th className="py-3 px-4 text-center">Passing Score</th>
            <th className="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No attempts found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                onClick={() => {
                  router.push;
                }}
                key={row.id}
                className="border-b border-gray-300 last:border-b-0 hover:bg-gray-100 transition hover:cursor-pointer"
              >
                <td
                  className="py-3 px-4 text-blue-600 hover:underline cursor-pointer text-center"
                  onClick={() =>
                    router.push(`/application/admin/attempts/${row.id}`)
                  }
                >
                  {row.exam.title}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.user.first_name} {row.user.last_name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {row.user.email}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">{row.score}</td>
                <td className="py-3 px-4 text-center">
                  {row.exam.passing_score}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "passed"
                        ? "bg-green-100 text-green-700"
                        : row.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {formatStatus(row.status)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import { ExamAttempt, ExamInvitation } from "@/types/Exam";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
interface InvitationTableProps {
  examInvitations: ExamInvitation[];
  setInvitations: React.Dispatch<React.SetStateAction<ExamInvitation[]>>;
  examAttempts: ExamAttempt[];
}

export default function UserInvitationTable({
  examInvitations,
  setInvitations,
  examAttempts,
}: InvitationTableProps) {
  const router = useRouter();
  if (examInvitations.length == 0) {
    return (
      <p className="text-center pt-5 text-sm italic text-gray-400">
        No users are invited yet
      </p>
    );
  }
  return (
    <div className="overflow-x-auto border-gray-200 border-1 rounded-xl">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
            <th className="py-3 px-4">User Email</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Sent At</th>
            <th className="py-3 px-4">Attempt</th>
            <th className="py-3 px-4">Score</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {examInvitations.map((row) => {
            const attempt = examAttempts.find(
              (a) => a.user.id === row.user.id && a.exam.id === row.exam
            );

            return (
              <tr
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/application/admin/exams/${row.exam}/${row.user.id}`
                  );
                }}
                key={row.id}
                className="border-b border-gray-300 last:border-b-0 hover:bg-gray-200 transition hover:cursor-pointer"
              >
                <td className="py-3 px-4">{row.user.email}</td>
                <td className="py-3 px-4">{row.user.department_name}</td>
                <td className="py-3 px-4">
                  {format(new Date(row.sent_at), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="py-3 px-4">
                  {attempt ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attempt.status === "passed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {attempt.status}
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      Not Attempted
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">{attempt ? attempt.score : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import { ExamInvitation } from "@/types/Exam";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
interface InvitationTableProps {
  examInvitations: ExamInvitation[];
  setInvitations: React.Dispatch<React.SetStateAction<ExamInvitation[]>>;
}

export default function UserInvitationTable({
  examInvitations,
  setInvitations,
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
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Sent At</th>
            <th className="py-3 px-4">Attempted</th>
            <th className="py-3 px-4">Department</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {examInvitations.map((row) => (
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
              <td className="py-3 px-4">{row.user.role}</td>
              <td className="py-3 px-4">
                {format(new Date(row.sent_at), "yyyy-MM-dd HH:mm")}
              </td>
              <td className="py-3 px-4">
                {row.is_attempted ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    Yes
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                    No
                  </span>
                )}
              </td>
              {/* <td className="py-3 px-4 text-gray-500 cursor-pointer">
                <div
                  title="Delete Invitation"
                  className="hover:cursor-pointer text-gray-500 hover:bg-white hover:text-gray-600 text-center rounded-full p-2"
                  onClick={() =>
                    showModal(() => handleDelete(row), {
                      title: "Delete Confirmation",
                      message:
                        "Are you sure you want to delete this invitation?",
                      confirmLabel: "Delete",
                    })
                  }
                >
                  <Trash width={18} height={18} />
                </div>
              </td> */}
              <td className="py-3 px-4">{row.user.department_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

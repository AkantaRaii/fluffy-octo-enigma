"use client";
import { Exam } from "@/types/Exam";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ExamTableProps {
  activeTab: "activeExam" | "pastExam";
  exams: Exam[];
}

export default function ExamTable({ activeTab, exams }: ExamTableProps) {
  const router = useRouter();
  const now = new Date();

  const getExamStatus = (exam: Exam) => {
    const start = new Date(exam.scheduled_start);
    const end = new Date(exam.scheduled_end);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Passed";
  };

  return (
    <div className="overflow-x-auto border-gray-200 border rounded-xl">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Starts On</th>
            <th className="py-3 px-4">Ends On</th>
            <th className="py-3 px-4">Duration</th>
            <th className="py-3 px-4">Passing Marks</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {exams.length > 0 ? (
            exams
              .filter((exam) => {
                const status = getExamStatus(exam);
                return activeTab === "activeExam"
                  ? status !== "Passed"
                  : status === "Passed";
              })
              .map((exam) => {
                const status = getExamStatus(exam);
                return (
                  <tr
                    key={exam.id}
                    onClick={() =>
                      status === "Passed"
                        ? router.push(
                            `/application/user/upcoming/result/${exam.id}`
                          )
                        : router.push(`/application/user/upcoming/${exam.id}`)
                    }
                    className="border-b border-gray-300 last:border-b-0 hover:bg-gray-100 hover:cursor-pointer transition"
                  >
                    <td className="py-3 px-4">{exam.title}</td>
                    <td className="py-3 px-4">{exam.department_name}</td>
                    <td className="py-3 px-4">
                      {format(
                        new Date(exam.scheduled_start),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(exam.scheduled_end), "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="py-3 px-4">{exam.duration_minutes} mins</td>
                    <td className="py-3 px-4">{exam.passing_score}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === "Upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : status === "Ongoing"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan={8} className="py-4 text-center text-gray-500 italic">
                No exams available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

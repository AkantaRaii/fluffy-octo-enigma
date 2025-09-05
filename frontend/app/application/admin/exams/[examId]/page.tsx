import { NextPage } from "next";
import { Exam, ExamAttempt, ExamInvitation } from "@/types/Exam";
import apiServer from "@/utils/axiosServer";
import Body from "./components/Body";
import { ExamQuestion } from "@/types/QuestionOption";
import { Department } from "@/types/Depertment";
import { format } from "date-fns";

// Define the props type explicitly
interface PageProps {
  params: Promise<{ examId: string }>;
}

// Use NextPage to type the component
const Page: NextPage<PageProps> = async ({ params }: PageProps) => {
  const { examId } = await params;

  const examRes = await apiServer.get(`/api/v1/exams/exams/${examId}/`);
  const exam: Exam = examRes.data;

  const examInvitationsRes = await apiServer.get(
    `/api/v1/exams/examinvitations/?exam=${examId}`
  );
  const examInvitations: ExamInvitation[] = examInvitationsRes.data;

  const examAttemptsRes = await apiServer.get(
    `/api/v1/examsession/attempts/?exam=${examId}`
  );
  const examAttempts: ExamAttempt[] = examAttemptsRes.data;

  const examQuestionsRes = await apiServer.get(
    `/api/v1/exams/examquestions/?exam=${examId}`
  );
  const examQuestions: ExamQuestion[] = examQuestionsRes.data;

  const departmentRes = await apiServer.get(`/api/v1/exams/departments/`);
  const departments: Department[] = departmentRes.data;

  return (
    <div className="max-w-7xl py-2">
      {/* Exam Info Card */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Exam: <span className="text-theme">{exam.title}</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
          <div>
            <span className="font-semibold">Department:</span>{" "}
            {exam.department_name}
          </div>
          <div>
            <span className="font-semibold">Scheduled Start:</span>{" "}
            <span className="font-medium text-gray-900">
              {format(new Date(exam.scheduled_start), "MMM dd, yyyy")}
            </span>{" "}
            <span className="text-xs text-lime-800">
              {format(new Date(exam.scheduled_start), "hh:mm a")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Scheduled End:</span>{" "}
            <span className="font-medium text-gray-900">
              {format(new Date(exam.scheduled_end), "MMM dd, yyyy")}
            </span>{" "}
            <span className="text-xs text-lime-800">
              {format(new Date(exam.scheduled_end), "hh:mm a")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {exam.duration_minutes} minutes
          </div>
          <div>
            <span className="font-semibold">Passing Score:</span>{" "}
            {exam.passing_score}%
          </div>
          {exam.repeat_after_days && (
            <div>
              <span className="font-semibold">Repeats every:</span>{" "}
              {exam.repeat_after_days} days
            </div>
          )}
        </div>
      </div>

      {/* Management Sections */}
      <Body
        examQuestions={examQuestions}
        exam={exam}
        departments={departments}
        examInvitations={examInvitations}
        examAttempts={examAttempts}
      />
    </div>
  );
};

export default Page;

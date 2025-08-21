import { Exam, ExamInvitation } from "@/types/Exam";
import apiServer from "@/utils/axiosServer";
import Body from "./components/Body";
import { ExamQuestion, Question } from "@/types/QuestionOption";
import { Department } from "@/types/Depertment";

interface Props {
  params: { examId: string };
}
export default async function page({ params }: Props) {
  //exam id from parameter
  const examId = await params.examId;
  const examRes = await apiServer.get(`/api/v1/exams/exams/${examId}/`);
  const exam: Exam = examRes.data;

  //inv users ko list
  const examInvitationsRes = await apiServer.get(
    `/api/v1/exams/examinvitations/?exam=${examId}`
  );
  const examInvitations: ExamInvitation[] = examInvitationsRes.data;

  //exam question ko list
  const examQuestionsRes = await apiServer.get(
    `/api/v1/exams/examquestions/?exam=${examId}`
  );
  const examQuestions: ExamQuestion[] = examQuestionsRes.data;

  //department  list
  const departmentRes = await apiServer.get(`/api/v1/exams/departments/`);
  const departments: Department[] = departmentRes.data;

  //jsx
  return (
    <div className=" max-w-7xl ">
      {/* Exam Info Card */}
      <div className=" mb-4">
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
            {new Date(exam.scheduled_start).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Scheduled End:</span>{" "}
            {new Date(exam.scheduled_end).toLocaleString()}
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
      />
    </div>
  );
}

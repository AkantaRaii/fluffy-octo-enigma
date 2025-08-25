// app/application/user/upcoming/[token]/page.tsx
import apiServer from "@/utils/axiosServer";
import ExamDashboard from "./components/ExamDashboard";

export default async function TokenPage({
  params,
}: {
  params: { examId: string; token: string };
}) {
  const { examId, token } = await params;

  // In a real app you’ll fetch exam data using params.token
  const examSessionRes = await apiServer(`api/v1/exams/start/${token}/`);
  const ExamSessionData: ExamSession = examSessionRes.data;

  const userAttemptResponse = await apiServer.post(
    `api/v1/examsession/attempts/`,
    { exam_id: examId }
  );
  console.log(userAttemptResponse.data);
  return <ExamDashboard exam={ExamSessionData} examId={examId} />;
}
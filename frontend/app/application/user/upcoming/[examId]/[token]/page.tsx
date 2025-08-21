// app/application/user/upcoming/[token]/page.tsx
import apiServer from "@/utils/axiosServer";
import ExamDashboard from "./components/ExamDashboard";

export default async function TokenPage({
  params,
}: {
  params: { examId: string; token: string };
}) {
  const { examId, token } = await params; // 👈 await here!
  console.log(examId, token);
  // In a real app you’ll fetch exam data using params.token
  const examSessionRes = await apiServer(`api/v1/exams/start/${token}/`);
  const ExamSessionData: ExamSession = examSessionRes.data;
  return <ExamDashboard exam={ExamSessionData} />;
}

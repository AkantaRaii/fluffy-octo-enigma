// app/application/user/upcoming/[token]/page.tsx
import apiServer from "@/utils/axiosServer";
import ExamDashboard from "./components/ExamDashboard";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

export default async function TokenPage({
  params,
}: {
  params: Promise<{ examId: string; token: string }>;
}) {
  const { examId, token } = await params;
  try {
    // Fetch exam session
    const examSessionRes = await apiServer.get(`api/v1/exams/start/${token}/`);
    const ExamSessionData: ExamSession = examSessionRes.data;

    // Try creating attempt
    const userAttemptResponse = await apiServer.post(
      `api/v1/examsession/attempts/`,
      { exam_id: examId }
    );

    // If backend signals already attempted
    if (userAttemptResponse.status === 400) {
      redirect(`/application/user/upcoming/result/${examId}`);
    }
    return <ExamDashboard exam={ExamSessionData} examId={examId} />;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error in TokenPage:", err.response?.data || err.message);

    if (err.response?.status === 400) {
      redirect(`/application/user/upcoming/result/${examId}`);
    }
    if (err.response?.status === 404) {
      redirect("/not-found");
    }
    if (err.response?.status === 401) {
      redirect("/login");
    }
    redirect("/error");
  }
}

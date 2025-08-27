// app/application/user/upcoming/[token]/page.tsx
import apiServer from "@/utils/axiosServer";
import ExamDashboard from "./components/ExamDashboard";
import { redirect } from "next/navigation";

export default async function TokenPage({
  params,
}: {
  params: { examId: string; token: string };
}) {
  const { examId, token } = params;
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
  } catch (error: any) {
    console.error(
      "Error in TokenPage:",
      error?.response?.data || error.message
    );
    // Example: if token invalid → redirect to not found
    if (error?.response?.status === 400) {
      redirect(`/application/user/upcoming/result/${examId}`);
    }
    if (error?.response?.status === 404) {
      redirect("/not-found");
    }
    // Example: if unauthorized
    if (error?.response?.status === 401) {
      redirect("/login");
    }
    // Fallback: show generic error page
    redirect("/error");
  }
}

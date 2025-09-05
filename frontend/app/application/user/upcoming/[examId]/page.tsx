// exam/start/[examId]/page.tsx
import { Exam, ExamInvitation } from "@/types/Exam";
import StartExamLanding from "./StartExamLanding";
import apiServer from "@/utils/axiosServer";
import { auth } from "@/lib/auth";

interface Props {
  params: Promise<{ examId: string }>;
}

export default async function Page({ params }: Props) {
  const { examId } = await params;
  const session = await auth();
  // console.log(session.user);

  // Fetch exam server-side
  const examRes = await apiServer(`/api/v1/exams/exams/${examId}/`);
  const exam: Exam = examRes.data;
  const examInvitationRes = await apiServer(
    `/api/v1/exams/examinvitations/?user=${session?.id}&exam=${exam.id}`
  );
  const invitations: ExamInvitation[] = examInvitationRes.data;
  const examInvitation = invitations.length > 0 ? invitations[0] : null;
  // console.log(examInvitation);
  return <StartExamLanding exam={exam} examInvitation={examInvitation} />;
}

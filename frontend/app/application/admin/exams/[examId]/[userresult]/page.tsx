import apiServer from "@/utils/axiosServer";
import Body from "./Body";

interface PageProps {
  params: Promise<{ examId: string; userresult: string }>;
}

export default async function Page({ params }: PageProps) {
  const { examId, userresult } = await params;
  const result = await apiServer(
    `api/v1/examsession/results/?exam=${examId}&user=${userresult}`
  );
  const attempResult = await result.data;
  const examResult = await apiServer(`api/v1/exams/exams/${examId}/`);
  const exam = examResult.data;
  return (
    <div>
      <div>
        <Body attempt={attempResult[0]} examTitle={exam.title} />
      </div>
    </div>
  );
}

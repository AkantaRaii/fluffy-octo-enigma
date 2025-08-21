import { Exam } from "@/types/Exam";
import ExamTable from "./UserExamTable";
import apiServer from "@/utils/axiosServer";

async function getExams(): Promise<Exam[]> {
  try {
    const res = await apiServer.get(`/api/v1/exams/exams/my-invitations/`);

    return await res.data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

export default async function Page() {
  const exams = await getExams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Available Exams</h1>
      <ExamTable exams={exams} />
    </div>
  );
}

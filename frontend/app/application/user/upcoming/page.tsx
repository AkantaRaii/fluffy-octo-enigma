import { Exam } from "@/types/Exam";
import ExamTable from "../../../../components/UserExamTable";
import apiServer from "@/utils/axiosServer";
import Body from "./Body";

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

  return <Body exams={exams} />;
}

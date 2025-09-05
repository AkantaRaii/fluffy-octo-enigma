import apiServer from "@/utils/axiosServer";
import { div } from "motion/react-client";
import Body from "./Body";

interface Props {
  params: Promise<{ examId: string }>;
}
export default async function page({ params }: Props) {
  //exam id from parameter
  const { examId } = await params;
  const resultRes = await apiServer(
    `api/v1/examsession/results/?exam=${examId}`
  );
  const attempResult = await resultRes.data;
  const examRes = await apiServer(`api/v1/exams/exams/${examId}/`);
  const exam = examRes.data;
  return (
    <div>
      <Body attempt={attempResult[0]} exam={exam} />
    </div>
  );
}

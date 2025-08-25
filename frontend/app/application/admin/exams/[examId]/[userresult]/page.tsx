import apiServer from "@/utils/axiosServer";
import Body from "./Body";

interface Props {
  params: {
    examId: string;
    userresult: string;
  };
}
export default async function page({ params }: Props) {
  //exam id from parameter
  const examId = await params.examId;
  const userresultId = await params.userresult;
  const result = await apiServer(
    `api/v1/examsession/results/?exam=${examId}&user=${userresultId}`
  );
  const attempResult = await result.data;
  return (
    <div>
      <div>
        <Body attempt={attempResult[0]} />
      </div>
    </div>
  );
}

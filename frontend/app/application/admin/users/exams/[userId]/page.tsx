import apiServer from "@/utils/axiosServer";
import AttemptTable from "./components/AttemptTable";

export default async function ExamAttempts({
  params,
}: {
  params: { userId: string };
}) {
  const res = await apiServer.get(
    `/api/v1/examsession/attempts/?user=${params.userId}`
  );
  const attempts = res.data;

  // Pass plain JSON to client component
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Exam Attempts</h1>
      <AttemptTable data={attempts} />
    </div>
  );
}

import apiServer from "@/utils/axiosServer";
import AttemptTable from "./components/AttemptTable";
interface Props {
  params: Promise<{ userId: string }>;
}
export default async function ExamAttempts({ params }: Props) {
  const { userId } = await params;
  const res = await apiServer.get(
    `/api/v1/examsession/attempts/?user=${userId}`
  );
  const attempts = res.data;

  // Pass plain JSON to client component
  return (
    <div className="py-2">
      <h1 className="text-xl font-semibold mb-4">
        {attempts[0].user.first_name} {attempts[0].user.last_name}
      </h1>
      <AttemptTable data={attempts} />
    </div>
  );
}

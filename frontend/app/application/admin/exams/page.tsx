import { fetchServer } from "@/utils/fetchServer";
import ExamCard from "./components/ExamCard";
import Table from "./components/table";
import { Exam } from "@/types/Exam";
import ExamBody from "./ExamBody";
import { Department } from "@/types/Depertment";

export default async function () {
  const examRes = await fetchServer(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/exams/exams/`
  );
  const exams: Exam[] = examRes.data;
  const departmentRes = await fetchServer(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/exams/departments/`
  );
  const departments: Department[] = departmentRes.data;

  return (
    <div className="container mx-auto py-2">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div> */}
      <ExamBody examList={exams} departments={departments} />
    </div>
  );
}

import { fetchServer } from "@/utils/fetchServer";
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
      <ExamBody examList={exams} departments={departments} />
    </div>
  );
}

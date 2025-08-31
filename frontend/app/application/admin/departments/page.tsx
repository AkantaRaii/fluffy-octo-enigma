import { fetchServer } from "@/utils/fetchServer";
import { Department } from "@/types/Depertment";
import Table from "./components/table";
export default async function () {
  let departments: Department[] = [];
  try {
    const res = await fetchServer(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/exams/departments/`
    );
    if (res?.data) {
      departments = res.data as Department[];
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <Table data={departments} />
    </div>
  );
}

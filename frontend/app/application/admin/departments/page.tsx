import { fetchServer } from "@/utils/fetchServer";
import { Department } from "@/types/Depertment";
import Table from "./components/table";
export default async function () {
  const sampleData = [
    {
      id: 1,
      header: "Cover page",
      sectionType: "Cover page",
      status: "In Process" as const,
      target: 18,
      limit: 5,
      reviewer: "Eddie Lake",
    },
    {
      id: 2,
      header: "Technical approach",
      sectionType: "Narrative",
      status: "Done" as const,
      target: 27,
      limit: 23,
      reviewer: "Jamik Tashpulatov",
    },
  ];
  const res = await fetchServer(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/exams/departments/`
  );
  const departments: Department[] = res.data;

  return (
    <div className="">
      <h1 className="text-3xl font-semibold ">Departments</h1>
      {/* {departments.map((department) => (
        <li key={department.id}>{department.name}</li>
      ))} */}
      <Table data={sampleData} />
    </div>
  );
}

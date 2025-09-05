import apiServer from "@/utils/axiosServer";
import { User } from "@/types/User";
import { Department } from "@/types/Depertment";
import Body from "./components.tsx/Body";
interface Props {
  params: Promise<{ deptId: string }>; 
}

export default async function Page({ params }: Props) {
  const { deptId } = await params;
  let users: User[] = [];
  let department: Department | null = null;
  try {
    const response = await apiServer(`api/v1/auth/users/?department=${deptId}`);
    users = response.data;
    const deptResponse = await apiServer(`api/v1/exams/departments/${deptId}/`);
    department = deptResponse.data;
  } catch (error) {
    console.error("server failed", error);
  }
  return (
    <div className="max-w-7xl py-2 ">
      <h1 className="text-2xl font-bold text-gray-900">
        Department: <span className="text-theme">{department?.name}</span>
      </h1>
      <Body users={users} />
    </div>
  );
}

import apiServer from "@/utils/axiosServer";
import { User } from "@/types/User";
import { Department } from "@/types/Depertment";
import Body from "./components/Body";
interface Props {
  params: {
    deptId: string;
  };
}

export default async function Page({ params }: Props) {
  const deptId = params.deptId;
  let users: User[] = [];
  let department: Department | null = null;
  try {
    const response = await apiServer(`api/v1/auth/users/`);
    users = response.data;
    const deptResponse = await apiServer(`api/v1/exams/departments/${deptId}/`);
    department = deptResponse.data;
  } catch (error) {
    console.error("server failed");
  }
  return (
    <div className="max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 ">
        Department: <span className="text-theme">Users</span>
      </h1>
      <Body users={users} />
    </div>
  );
}

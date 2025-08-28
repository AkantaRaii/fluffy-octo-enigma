import apiServer from "@/utils/axiosServer";
import RegisterForm from "./RegisterForm";
import { Department } from "@/types/Depertment";
export default async function Page() {
  const departmentsRes = await apiServer("/api/v1/exams/departments/");
  const departments: Department[] = departmentsRes.data;
  return (
    <div className="grid sm:grid-cols-12 grid-cols-1 h-screen">
        <div className="sm:col-span-7   overflow-hidden p-20 md:block hidden">
        <div className="p-20 w-full h-full flex justify-center items-center">
          <img
            src="./register_image.png"
            alt="register image"
            className="object-contain max-w-full max-h-full"
          />
        </div>
      </div>
      <div className="md:col-span-5 col-span-12 block">
        <RegisterForm departments={departments} />
      </div>
    </div>
  );
}

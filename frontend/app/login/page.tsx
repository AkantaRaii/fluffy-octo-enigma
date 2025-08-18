import { fetchServer } from "@/utils/fetchServer";
import InputField from "./inputField";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import apiServer from "@/utils/axiosServer";
interface MeApiData {
  email: string;
  role: string;
}
export default async function Login() {
  const session = await auth();
  if (session) {
    try {
      const res = await apiServer.get(`/api/v1/auth/me/`);
      const data: MeApiData = res.data;

      if (res.status === 200) {
        if (data.role === "ADMIN") return redirect("/application/admin");
        if (data.role === "USER") return redirect("/application/user");
      }
    } catch (err: any) {
      // if 401 or other error → just fall through to render content
      console.error("auth/me failed", err?.response?.status);
    }
  }
  return (
    <div className="h-screen grid sm:grid-cols-12 grid-cols-1">
      <div className="md:col-span-7 relative shadow-neutral-800 md:block hidden">
        <img
          src="login.png"
          alt="login"
          className="col-span-2 h-screen w-full object-cover absolute top-0"
        />
      </div>
      <div className=" md:col-span-5 col-span-12 block">
        <InputField />
      </div>
    </div>
  );
}

import InputField from "./inputField";
import { redirect } from "next/navigation";
import apiServer from "@/utils/axiosServer";
import { auth } from "@/lib/auth";
import Image from "next/image";

interface MeApiData {
  email: string;
  role: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("auth/me failed", err.message);
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as ApiError).response?.status === "number"
      ) {
        console.error("auth/me failed", (err as ApiError).response?.status);
      } else {
        console.error("auth/me failed: unknown error", err);
      }
    }
  }

  return (
    <div className="grid sm:grid-cols-12 grid-cols-1 h-screen">
      <div className="sm:col-span-7 overflow-hidden p-20 md:block hidden">
        <div className="p-20 w-full h-full flex justify-center items-center">
          <Image
            src="/login_image.png"
            alt="register image"
            width={500}
            height={500}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      </div>
      <div className="md:col-span-5 col-span-12 block">
        <InputField />
      </div>
    </div>
  );
}

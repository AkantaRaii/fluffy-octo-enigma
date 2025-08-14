import { fetchServer } from "@/utils/fetchServer";
import InputField from "./inputField";
import { redirect } from "next/navigation";

export default async function Login() {
  try {
    const res = await fetchServer<{ success: boolean }>(
      `${process.env.BASE_URL}/api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.success) {
      redirect("/dashboard"); // only redirect if backend returns success
    }
  } catch (err) {   
    console.error("Error fetching session:", err);
    // fallback: show login form
  }

  return (
    <div className="h-screen grid sm:grid-cols-12 grid-cols-1">
      <div className="md:col-span-7 relative bg-theme shadow-neutral-800 md:block hidden">
        <img
          src="login.png"
          alt="login"
          className="col-span-2 h-screen w-full object-cover absolute top-0"
        />
      </div>
      <div className="md:col-span-5 col-span-12 block">
        <InputField />
      </div>
    </div>
  );
}

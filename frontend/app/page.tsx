import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return <div className="text-3xl">kadnfakdsjfn</div>;
}

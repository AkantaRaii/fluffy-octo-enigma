import apiServer from "@/utils/axiosServer";
import Body from "./Body";

export default async function Page() {
  const res = await apiServer.get("/api/v1/exams/dashboard/admin/");
  const data = res.data;

  return <Body data={data} />;
}

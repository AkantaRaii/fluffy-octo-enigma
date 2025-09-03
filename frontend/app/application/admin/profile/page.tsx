import ProfileSection from "@/components/ProfileSection";
import apiServer from "@/utils/axiosServer";

export default async function AccountPage() {
  // ✅ Fetch data server-side
  const res = await apiServer.get("/api/v1/auth/me/");
  const user = res.data;

  return (
    <div>
      <ProfileSection initialUser={user} />
    </div>
  );
}

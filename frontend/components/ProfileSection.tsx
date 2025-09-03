// components/ProfileSection.tsx
"use client";

import { useRouter } from "next/navigation";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: { id: number; name: string } | null;
}

export default function ProfileSection({ user }: { user: UserProfile }) {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">My Profile</h2>

      <div className="grid gap-4">
        <ProfileRow label="Full Name" value={`${user.first_name} ${user.last_name}`} />
        <ProfileRow label="Email" value={user.email} />
        <ProfileRow label="Phone" value={user.phone || "—"} />
        <ProfileRow label="Role" value={user.role} />
        <ProfileRow label="Department" value={user.department?.name || "—"} />
      </div>

      <div className="pt-4 border-t flex justify-between">
        <button
          onClick={() => router.push("/profile/edit")}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Edit Profile
        </button>
        <button
          onClick={() => router.push("/profile/change-password")}
          className="px-4 py-2 rounded-lg bg-theme text-white hover:bg-theme-dark"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

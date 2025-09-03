"use client";

import { useEffect, useState } from "react";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string | null;
  role: string;
}

export default function AccountSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [editField, setEditField] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiClient.get("/api/v1/auth/me/");
      setUser(res.data);
      setFormData(res.data);
    };
    fetchUser();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };
  const handleChangePassword = async () => {
    const res = await apiClient.post(
      `api/v1/auth/users/forgot-password/request/`,
      {
        email: formData.email,
      }
    );
    if (res.status === 200) {
      toast.success(res.data.message); // optional
      const email = formData.email;
      if (email) {
        router.push(`/login/verify?email=${encodeURIComponent(email)}`);
      }
    }
  };
  const handleSave = async () => {
    if (!user) return;
    try {
      const email = formData.email;
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      };
      console.log(payload);
      const res = await apiClient.patch(
        `/api/v1/auth/users/${user.id}/`,
        payload
      );
      toast.success("Account fields are updated.");
      setUser(res.data);
      setFormData(res.data);
      setEditField(null);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const renderField = (
    label: string,
    field: keyof User,
    type = "text",
    readOnly = false
  ) => {
    return (
      <div className="mb-5 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {editField === field && !readOnly ? (
          <input
            type={type}
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => setEditField(null)}
            autoFocus
            className={`w-full border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          />
        ) : (
          <div
            className={`w-full border border-gray-300 rounded-md p-2 cursor-pointer hover:border-gray-400 transition-colors ${
              readOnly
                ? "bg-gray-100 cursor-default hover:cursor-not-allowed"
                : ""
            }`}
            onClick={() => !readOnly && setEditField(field)}
          >
            {formData[field] || (
              <span className="text-gray-400">Click to add</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10">
      {/* Main Content */}
      <main className="flex-1 pl-8">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>

        <section className="mb-10">
          <div className="flex flex-row justify-between gap-2">
            {renderField("First Name", "first_name")}
            {renderField("Last Name", "last_name")}
          </div>
          <div className="flex flex-row justify-between gap-2">
            {renderField("Email", "email", "email", true)}
            {renderField("Phone", "phone")}
          </div>
          <div className="flex flex-row justify-between gap-2">
            {renderField("Department", "department", "department", true)}
            <button
              title="change password"
              onClick={handleChangePassword}
              className="px-6 rounded-md h-10 hover:cursor-pointer text-white bg-theme hover:opacity-80 transition-colors self-center min-w-fit"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex justify-end items-center mt-6">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isDirty
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>

          {/* Change Password Button */}
        </div>
      </main>
    </div>
  );
}

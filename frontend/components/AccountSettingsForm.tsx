"use client";

import { useState } from "react";
import apiClient from "@/utils/axiosClient";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string | null;
  role: string;
}

interface Props {
  user: User;
  editableFields: (keyof User)[];
  isSelf: boolean; // true if editing own profile
}

export default function AccountSettingsForm({
  user,
  editableFields,
  isSelf,
}: Props) {
  const [formData, setFormData] = useState<Partial<User>>(user);
  const [editField, setEditField] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      // only send editable fields
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone, // include if you want this editable
      };
      console.log(payload);
      const res = await apiClient.patch(
        `/api/v1/auth/users/${user.id}/`,
        payload
      );
      setFormData(res.data);
      setEditField(null);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const renderField = (
    label: string,
    field: keyof User,
    type = "text",
    readOnly = false
  ) => {
    const isEditable = editableFields.includes(field) && !readOnly;

    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {editField === field && isEditable ? (
          <input
            type={type}
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => setEditField(null)}
            autoFocus
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div
            className={`w-full border border-gray-200 rounded-md p-2 cursor-pointer hover:border-gray-400 transition-colors ${
              !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            onClick={() => isEditable && setEditField(field)}
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
    <div>
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4 border-b border-gray-400 pb-2">
          Profile
        </h2>
        {renderField("First Name", "first_name")}
        {renderField("Last Name", "last_name")}
        {renderField("Email", "email", "email", true)}
        {renderField("Phone", "phone")}
        {renderField("Department", "department", "text", true)}
      </section>

      {isSelf && (
        <div className="flex justify-end">
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
        </div>
      )}
    </div>
  );
}

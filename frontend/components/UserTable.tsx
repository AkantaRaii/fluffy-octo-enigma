"use client";
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { User } from "@/types/User";
import { useModal } from "@/context/ModalContext";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";

interface TableProps {
  data: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserTable({ data, onEdit, onDelete }: TableProps) {
  // Local state for users so we can update immediately
  const [users, setUsers] = useState<User[]>(data);
  const { showModal } = useModal();

  const handleVerify = async (userId: number) => {
    try {
      const res = await apiClient.patch(`api/v1/auth/users/${userId}/`, {
        is_verified: true,
      });

      if (res.status === 200) {
        toast.success("User verified successfully");

        // Update state so UI reflects immediately
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_verified: true } : u
          )
        );
      } else {
        toast.error("Failed to verify user");
      }
    } catch (error) {
      toast.error("Failed to verify user");
      console.error("Error verifying user:", error);
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Verified</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
            >
              {/* Name */}
              <td className="py-3 px-4 font-semibold">
                {user.first_name} {user.last_name}
              </td>

              {/* Email */}
              <td className="py-3 px-4">{user.email}</td>

              {/* Role */}
              <td className="py-3 px-4">{user.role}</td>

              {/* Phone */}
              <td className="py-3 px-4">{user.phone}</td>

              {/* Verified */}
              <td className="py-3 px-4">
                {user.is_verified ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Unverified
                  </span>
                )}
              </td>

              {/* Department */}
              <td className="py-3 px-4">
                {user.department_name ?? (
                  <span className="text-gray-400 italic">None</span>
                )}
              </td>

              {/* Actions */}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  {/* Verify button */}
                  <button
                    title={
                      user.is_verified ? "Already Verified" : "Verify User"
                    }
                    className={`p-2 rounded-full transition ${
                      user.is_verified
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-green-100 text-green-600"
                    }`}
                    disabled={user.is_verified}
                    onClick={(e) => {
                      e.stopPropagation();
                      showModal(() => handleVerify(user.id), {
                        title: "Verify Confirmation",
                        message: `Are you sure you want to verify ${
                          user.first_name + " " + user.last_name
                        }?`,
                        confirmLabel: "Verify",
                      });
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

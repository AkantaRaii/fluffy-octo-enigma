"use client";
import React from "react";
import { FilePenLine, Trash } from "lucide-react";
import { User } from "@/types/User";

interface TableProps {
  data: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserTable({ data, onEdit, onDelete }: TableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Verified</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700">
          {data.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
            >
              {/* ID */}
              <td className="py-3 px-4 font-medium">{user.id}</td>

              {/* Email */}
              <td className="py-3 px-4">{user.email}</td>

              {/* Role */}
              <td className="py-3 px-4">{user.role}</td>

              {/* Phone */}
              <td className="py-3 px-4">{user.phone}</td>

              {/* Verified Pill */}
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_verified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_verified ? "Verified" : "Unverified"}
                </span>
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
                  {/* Edit */}
                  <button
                    title="Edit User"
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    onClick={() => onEdit?.(user)}
                  >
                    <FilePenLine className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Delete */}
                  <button
                    title="Delete User"
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    onClick={() => onDelete?.(user)}
                  >
                    <Trash className="w-4 h-4 text-red-600" />
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

"use client";
import React, { useState } from "react";
import { Users, FileText, Plus, Trash, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Department } from "@/types/Depertment";
import DepartmentModal from "./DepartmentModal";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";
import PromptConfirmModal from "@/context/PromptConfirmModal";

interface TableProps {
  data: Department[];
}

export default function DepartmentTable({ data }: TableProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>(data);
  const [openModal, setOpenModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleDelete = async () => {
    if (!selectedDept) return;
    try {
      await apiClient.delete(`/api/v1/exams/departments/${selectedDept.id}/`);
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== selectedDept.id)
      );
      toast.success("Department deleted successfully");
    } catch (err) {
      toast.error("Failed to delete department");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="py-2 font-semibold text-xl">Departments</h1>
        <button
          title="Add Department"
          onClick={() => {
            setEditingDept(null); // new dept
            setOpenModal(true);
          }}
          className="border text-white border-gray-300 px-4 rounded-sm shadow-gray-300 shadow  bg-midTheme hover:opacity-70 flex flex-row items-center justify-around cursor-pointer "
        >
          <Plus width={16} height={16} />
          <p>Add Department</p>
        </button>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm relative">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-200 transition hover:cursor-pointer"
                onClick={() =>
                  router.push(`/application/admin/departments/users/${dept.id}`)
                }
              >
                <td className="py-3 px-4 font-medium">{dept.id}</td>
                <td className="py-3 px-4">{dept.name}</td>
                <td className="py-3 px-4">{dept.description}</td>

                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      title="Edit Department"
                      className="p-2 rounded-full hover:bg-white transition hover:cursor-pointer"
                      onClick={() => {
                        setEditingDept(dept); // pass current dept
                        setOpenModal(true);
                      }}
                    >
                      <SquarePen className="w-4 h-4 text-theme" />
                    </button>
                    <button
                      title="Delete Department"
                      className="p-2 rounded-full hover:bg-white transition hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDept(dept);
                        setShowPrompt(true);
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {openModal && (
          <DepartmentModal
            setOpen={setOpenModal}
            editingDept={editingDept}
            setDepartments={setDepartments}
          />
        )}

        {/* Confirm Delete */}
        {showPrompt && selectedDept && (
          <PromptConfirmModal
            isOpen={showPrompt}
            onClose={() => setShowPrompt(false)}
            onConfirm={handleDelete}
            title="Delete Department"
            message={`Are you sure you want to delete department "${selectedDept?.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            confirmPrompt={selectedDept?.name}
            typeThis="Department Name"
          />
        )}
      </div>
    </div>
  );
}

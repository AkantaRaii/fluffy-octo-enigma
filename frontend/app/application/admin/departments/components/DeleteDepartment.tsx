"use client";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { Department } from "@/types/Depertment";

interface Props {
  setDeleteDeptForm: (value: boolean) => void;
  setDepartments: Dispatch<SetStateAction<Department[]>>;
  dept: Department;
}

export default function DeleteDepartment({
  setDeleteDeptForm,
  setDepartments,
  dept,
}: Props) {
  async function handleDelete() {
    try {
      await apiClient.delete(`/api/v1/exams/departments/${dept.id}/`);
      setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
      setDeleteDeptForm(false);
      toast.success("Department deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete department.");
      console.error("Delete department error:", error);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setDeleteDeptForm(false)}
      ></div>

      <div className="fixed right-0 top-0 w-full max-w-md bg-white h-full shadow-lg z-50 animate-slideIn flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-md font-semibold text-red-600">
            Delete Department
          </h2>
          <button
            onClick={() => setDeleteDeptForm(false)}
            className="p-2 rounded-md bg-gray-500 cursor-pointer opacity-70"
          >
            <X className="text-white" width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete the department{" "}
            <span className="font-semibold">{dept.name}</span>?
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setDeleteDeptForm(false)}
              className="px-4 py-2 rounded-md bg-gray-200 cursor-pointer opacity-70"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white cursor-pointer opacity-70"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

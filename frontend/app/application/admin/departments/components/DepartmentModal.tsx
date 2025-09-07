"use client";
import { useState, useEffect } from "react";
import { Department } from "@/types/Depertment";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";

interface Props {
  setOpen: (value: boolean) => void;
  setDepartments: Dispatch<SetStateAction<Department[]>>;
  editingDept: Department | null;
}

export default function DepartmentModal({
  setOpen,
  setDepartments,
  editingDept,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // prefill when editing
  useEffect(() => {
    if (editingDept) {
      setName(editingDept.name);
      setDescription(editingDept.description);
    }
  }, [editingDept]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingDept) {
        // update
        const res = await apiClient.patch(
          `/api/v1/exams/departments/${editingDept.id}/`,
          { name, description }
        );
        const updated: Department = res.data;
        setDepartments((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
        toast.success("Department updated successfully!");
      } else {
        // create
        const res = await apiClient.post("/api/v1/exams/departments/", {
          name,
          description,
        });
        const dept: Department = res.data;
        setDepartments((prev) => [...prev, dept]);
        toast.success("Department created successfully!");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save department. Please try again.");
      console.error("Department save error:", error);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setOpen(false)}
      ></div>

      <div className="fixed right-0 top-0 w-full max-w-md bg-white h-full shadow-lg z-50 animate-slideIn flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-md font-semibold text-gray-800">
            {editingDept ? "Edit Department" : "Add Department"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md bg-gray-500"
          >
            <X
              className="cursor-pointer opacity-70 text-white"
              width={14}
              height={14}
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              {editingDept ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

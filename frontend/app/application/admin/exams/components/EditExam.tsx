"use client";
import { useState } from "react";
import { Department } from "@/types/Depertment";
import { Exam } from "@/types/Exam";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import apiClient from "@/utils/axiosClient";
import ExamForm from "./ExamForm";
import toast from "react-hot-toast";

interface Props {
  exam: Exam;
  setEditExamForm: (value: boolean) => void;
  setExams: Dispatch<SetStateAction<Exam[]>>;
  departments: Department[];
}

export default function EditExam({
  exam,
  setEditExamForm,
  setExams,
  departments,
}: Props) {
  async function handleEdit(payload: any) {
    try {
      const res = await apiClient.put(
        `/api/v1/exams/exams/${exam.id}/`,
        payload
      );
      setExams((prev) => prev.map((e) => (e.id === exam.id ? res.data : e)));
      setEditExamForm(false);
      toast.success("Exam updated successfully!");
    } catch (error) {
      toast.error("Failed to update exam. Please try again.");
      console.error("Update exam error:", error);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setEditExamForm(false)}
      ></div>

      <div className="fixed right-0 top-0 w-full max-w-md bg-cleanWhite h-full shadow-lg z-50 animate-slideIn flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-cleanWhite z-10">
          <h2 className="text-md font-semibold text-primaryText">Edit Exam</h2>
          <button
            onClick={() => setEditExamForm(false)}
            className="p-2 rounded-md bg-gray-500"
          >
            <X className="text-white" width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ExamForm
            initialData={exam}
            departments={departments}
            onSubmit={handleEdit}
            onCancel={() => setEditExamForm(false)}
            isAdd={false}
          />
        </div>
      </div>
    </>
  );
}

"use client";
import { useState } from "react";
import { Department } from "@/types/Depertment";
import { Exam } from "@/types/Exam";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import apiClient from "@/utils/axiosClient";
import ExamForm from "./ExamForm";

interface Props {
  setAddExamForm: (value: boolean) => void;
  setExams: Dispatch<SetStateAction<Exam[]>>;
  departments: Department[];
}

export default function AddExam({
  setAddExamForm,
  setExams,
  departments,
}: Props) {
  async function handleAdd(
    payload: any,
    options?: { addAllQuestions: boolean; addAllUsers: boolean }
  ) {
    const res = await apiClient.post("/api/v1/exams/exams/", payload);
    const exam: Exam = res.data;

    // Update UI immediately
    setExams((prev) => [...prev, exam]);
    setAddExamForm(false);

    // Only do extra calls if checkboxes ticked
    if (options) {
      const { addAllQuestions, addAllUsers } = options;

      if (addAllQuestions) {
        const res = await apiClient.post(
          "/api/v1/exams/examquestions/bulk_create/",
          {
            exam_id: exam.id,
            department_id: payload.department,
          }
        );
      }

      if (addAllUsers) {
        await apiClient.post(
          `/api/v1/exams/examinvitations/add-department-users/`,
          {
            exam: exam.id,
            department: payload.department,
          }
        );
      }
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setAddExamForm(false)}
      ></div>

      <div className="fixed right-0 top-0 w-full max-w-md bg-cleanWhite h-full shadow-lg z-50 animate-slideIn flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-cleanWhite z-10">
          <h2 className="text-md font-semibold text-primaryText">Add Exam</h2>
          <button
            onClick={() => setAddExamForm(false)}
            className="p-2 rounded-md bg-gray-500"
          >
            <X className="text-white" width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ExamForm
            departments={departments}
            onSubmit={handleAdd}
            onCancel={() => setAddExamForm(false)}
            isAdd={true}
          />
        </div>
      </div>
    </>
  );
}

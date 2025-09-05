"use client";
import { X } from "lucide-react";
import { Department } from "@/types/Depertment";
import { Question } from "@/types/QuestionOption";
import QuestionForm from "./QuestionForm";
import apiClient from "@/utils/axiosClient";
import toast from "react-hot-toast";

interface Props {
  setAddQuestionForm: (value: boolean) => void;
  handleAddQuestion: (question: Question) => Promise<void>;
  departments: Department[];
}

export interface QuestionPayload {
  departments: number[];
  text: string;
  marks: number;
  type: "MCQ_SINGLE" | "MCQ_MULTI";
  options: {
    text: string;
    is_correct: boolean | number; // matches your backend shape
  }[];
}

export default function AddQuestion({
  setAddQuestionForm,
  handleAddQuestion,
  departments,
}: Props) {
  const onSubmit = async (payload: QuestionPayload) => {
    // ✅ Validation checks
    if (!payload.text || payload.text.trim().length < 5) {
      toast.error("Question text must be at least 5 characters long.");
      return;
    }
    if (payload.marks <= 0) {
      toast.error("Marks must be greater than 0.");
      return;
    }
    if (!payload.departments.length) {
      toast.error("Please select at least one department.");
      return;
    }
    if (!payload.options.length) {
      toast.error("Please add at least one option.");
      return;
    }
    if (payload.type === "MCQ_SINGLE") {
      const correctCount = payload.options.filter(
        (opt) => opt.is_correct
      ).length;
      if (correctCount !== 1) {
        toast.error(
          "Single choice question must have exactly one correct option."
        );
        return;
      }
    }
    if (payload.type === "MCQ_MULTI") {
      const correctCount = payload.options.filter(
        (opt) => opt.is_correct
      ).length;
      if (correctCount < 2) {
        toast.error(
          "Multiple choice question must have at least two correct options."
        );
        return;
      }
    }

    try {
      toast.success("Adding question...");
      const res = await apiClient.post(
        "/api/v1/exams/questionswithoptions/",
        payload
      );
      const newQuestion = res.data as Question;

      await handleAddQuestion(newQuestion);

      toast.success("Question added successfully!");
      setAddQuestionForm(false);
    } catch (err) {
      console.error("Error adding question:", err);
      toast.error("Failed to add question. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setAddQuestionForm(false)}
      ></div>

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 w-full max-w-2xl bg-white h-full shadow-lg z-50 animate-slideIn flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white z-10">
          <h2 className="text-md font-semibold text-gray-800">Add Question</h2>
          <button
            onClick={() => setAddQuestionForm(false)}
            className="p-2 rounded-md bg-gray-500"
          >
            <X className="text-white" width={14} height={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <QuestionForm
            departments={departments}
            onSubmit={onSubmit}
            onCancel={() => setAddQuestionForm(false)}
          />
        </div>
      </div>
    </>
  );
}

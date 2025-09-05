"use client";
import { X } from "lucide-react";
import { Department } from "@/types/Depertment";
import { Question } from "@/types/QuestionOption";
import QuestionForm from "./QuestionForm";
import apiClient from "@/utils/axiosClient";

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
    try {
      // if you want to first create a new Question in backend
      const res = await apiClient.post(
        "/api/v1/exams/questionswithoptions/",
        payload
      );
      const newQuestion = res.data as Question;

      // then link it to the current exam
      await handleAddQuestion(newQuestion);

      setAddQuestionForm(false);
    } catch (err) {
      console.error("Error adding question:", err);
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

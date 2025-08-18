"use client";
import { useState } from "react";
import ManageUserPage from "./ManageUserPage";
import ManageQuestionPage from "./ManageQuestionPage";
import { ExamQuestion, Question } from "@/types/QuestionOption";
import { Exam } from "@/types/Exam";
import { Department } from "@/types/Depertment";
interface Props {
  examQuestions: ExamQuestion[];
  exam: Exam;
  departments: Department[];
}
export default function Body({ examQuestions, exam, departments }: Props) {
  const [activeTab, setActiveTab] = useState<"users" | "questions">("users");

  return (
    <div className=" w-full ">
      {/* Tab Bar / Segmented Control */}

      <div className="grid grid-cols-3">
        <div className="col-span-1"></div>
        <div className="flex w-full mb-2 rounded-lg border border-gray-200 bg-gray-300 p-1  col-span-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-4  rounded-md text-sm font-medium transition hover:cursor-pointer
              ${
                activeTab === "users"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600"
              }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition hover:cursor-pointer
              ${
                activeTab === "questions"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 "
              }`}
          >
            Manage Questions
          </button>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        {activeTab === "users" && <ManageUserPage />}
        {activeTab === "questions" && (
          <ManageQuestionPage examQuestions={examQuestions} exam={exam} departments={departments} />
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import ManageUserPage from "./ManageUserPage";
import ManageQuestionPage from "./ManageQuestionPage";
import { ExamQuestion } from "@/types/QuestionOption";
import { Exam, ExamInvitation } from "@/types/Exam";
import { Department } from "@/types/Depertment";
interface Props {
  examQuestions: ExamQuestion[];
  exam: Exam;
  departments: Department[];
  examInvitations: ExamInvitation[];
}
export default function Body({
  examQuestions,
  exam,
  departments,
  examInvitations,
}: Props) {
  const [activeTab, setActiveTab] = useState<"users" | "questions">("users");

  return (
    <div className=" w-full pt-2">
      {/* Tab Bar / Segmented Control */}

      <div className="flex justify-between">
        <div className="flex mb-2 rounded-lg border border-gray-200 bg-gray-300 p-1 ">
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
            className={`flex-1 px-4 rounded-md text-sm font-medium transition hover:cursor-pointer
              ${
                activeTab === "questions"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 "
              }`}
          >
            Manage Questions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        {activeTab === "questions" && (
          <ManageQuestionPage
            examQuestions={examQuestions}
            exam={exam}
            departments={departments}
          />
        )}
        {activeTab === "users" && <ManageUserPage examInvitations={examInvitations}/>}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import ExamTable from "../../../../components/UserExamTable";
import { Exam } from "@/types/Exam";
interface ExamTableProps {
  exams: Exam[];
}
export default function Body({ exams }: ExamTableProps) {
  const [activeTab, setActiveTab] = useState<"activeExam" | "pastExam">(
    "activeExam"
  );

  return (
    <div className=" w-full pt-2">
      {/* Tab Bar / Segmented Control */}
      <div className="flex justify-between">
        <div className="flex mb-2 rounded-lg border border-gray-200 bg-gray-300 p-1 ">
          <button
            onClick={() => setActiveTab("activeExam")}
            className={`flex-1 w-[200px] px-4 py-2 rounded-md text-sm font-medium transition hover:cursor-pointer
              ${
                activeTab === "activeExam"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600"
              }`}
          >
            Active Exams
          </button>
          <button
            onClick={() => setActiveTab("pastExam")}
            className={`flex-1 w-[200px] py-2 px-4 rounded-md text-sm font-medium transition hover:cursor-pointer
              ${
                activeTab === "pastExam"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 "
              }`}
          >
            Past Exams
          </button>
        </div>
      </div>
      <div className="py-6">
        <h1 className="text-xl font-semibold mb-4">Available Exams</h1>
        <ExamTable exams={exams} activeTab={activeTab} />
      </div>
    </div>
  );
}

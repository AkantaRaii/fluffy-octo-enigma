"use client";

import ResultQuestionCard, { Question } from "@/components/ResultQuestionCard";
import { DownloadReportButton } from "@/components/ExamReport";

interface Attempt {
  user: { id: number; email: string; first_name: string; last_name: string };
  total_questions: number;
  correct_answers: number;
  obtained_marks: number;
  total_marks: number;
  questions: Question[];
}

interface Props {
  attempt?: Attempt;
  examTitle: string;
}

export default function Body({ attempt, examTitle }: Props) {
  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto py-6 text-center text-gray-500">
        This user has not taken the exam yet.
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <DownloadReportButton examTitle={examTitle} attempt={attempt} />
      </div>

      {/* On-screen Report Preview */}
      <div className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow">
        {/* Summary */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Info */}
          <div className="border border-gray-300 rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm flex-1">
            <h1 className="text-sm md:text-md font-bold">
              Name:{" "}
              <span className="font-semibold text-gray-600">
                {attempt.user.first_name + " " + attempt.user.last_name}
              </span>
            </h1>
            <h1 className="text-sm md:text-md font-bold">
              Email:{" "}
              <span className="font-semibold text-gray-600">
                {attempt.user.email}
              </span>
            </h1>
          </div>

          {/* Exam Result */}
          <div className="border border-gray-300 rounded-xl p-4 md:p-6 shadow-sm flex-1">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
              Exam Result
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col justify-center items-center">
                <span className="font-semibold text-2xl md:text-3xl">
                  {attempt.total_questions}
                </span>
                <p className="text-gray-400 text-xs md:text-sm">
                  Total Questions
                </p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="font-semibold text-theme text-2xl md:text-3xl">
                  {attempt.correct_answers}
                </span>
                <p className="text-gray-400 text-xs md:text-sm">Correct</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="font-semibold text-2xl md:text-3xl">
                  {attempt.total_marks}
                </span>
                <p className="text-gray-400 text-xs md:text-sm">Total Marks</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="font-semibold text-2xl md:text-3xl">
                  {attempt.obtained_marks}
                </span>
                <p className="text-gray-400 text-xs md:text-sm">
                  Marks Obtained
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {attempt.questions.length > 0 ? (
            attempt.questions.map((q, idx) => (
              <ResultQuestionCard key={q.id} q={q} idx={idx} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No questions available</p>
          )}
        </div>
      </div>
    </div>
  );
}

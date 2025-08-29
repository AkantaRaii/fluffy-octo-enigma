"use client";

import DownloadPDFButton from "@/components/DownloadPDFButton";
import ResultQuestionCard, { Question } from "@/components/ResultQuestionCard";

interface Attempt {
  user: { id: number; email: string };
  total_questions: number;
  correct_answers: number;
  obtained_marks: number;
  total_marks: number;
  questions: Question[];
}
interface Props {
  attempt?: Attempt;
}
export default function Body({ attempt }: Props) {
  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto py-6 text-center text-gray-500">
        Loading result...
      </div>
    );
  }

  return (
    <div id="result" className=" w-full p-4 md:p-6">
      {/* Summary */}
      <div>
        <div className="mb-6 border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
          <h1 className="text-2xl font-bold mb-2 text-center">
            {attempt.user.email}
          </h1>
          {/* <DownloadPDFButton targetId="result" /> */}
        </div>
        <div className="mb-6 border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">Exam Result</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col gap justify-center items-center">
              <span className="font-semibold text-3xl">
                {attempt.total_questions}
              </span>
              <p className="text-gray-400">Total Questions</p>
            </div>
            <div className="flex flex-col gap justify-center items-center">
              <span className="font-semibold text-theme text-3xl">
                {attempt.correct_answers}
              </span>
              <p className="text-gray-400">Correct Answers</p>
            </div>
            <div className="flex flex-col gap justify-center items-center">
              <span className="font-semibold text-3xl">
                {attempt.total_marks}
              </span>
              <p className="text-gray-400">Total Marks</p>
            </div>
            <div className="flex flex-col gap justify-center items-center">
              <span className="font-semibold text-3xl">
                {attempt.obtained_marks}
              </span>
              <p className="text-gray-400">Marks Obtained</p>
            </div>
          </div>
        </div>
      </div>

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
  );
}

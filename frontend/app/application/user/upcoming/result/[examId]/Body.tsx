"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question_id: number;
  question_text: string;
  marks: number;
  user_selected_options: string[];
  correct_options: string[];
  is_correct: boolean;
}
// "id": 3,
//         "exam": 22,
//         "user": 1,
//         "start_time": "2025-08-21T12:45:36.452330+05:45",
//         "end_time": null,
//         "is_submitted": false,
//         "total_questions": 6,
//         "correct_answers": 2,
//         "obtained_marks": 3.0,
//         "total_marks": 10.0,

interface Attempt {
  total_questions: number;
  correct_answers: number;
  obtained_marks: number;
  is_submitted: boolean;
  total_marks: number;
  questions: Question[];
}

export default function ExamResult({ attempt }: { attempt?: Attempt }) {
  // If attempt is undefined at first (e.g., before API load)
  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500">
        Loading result...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Summary */}
      <div className="mb-6 border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Exam Result</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
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
          {/* <p>
            Status:
            <span
              className={`font-medium ml-1 ${
                attempt.is_submitted ? "text-green-600" : "text-orange-500"
              }`}
            >
              {attempt.is_submitted ? "Submitted" : "In Progress"}
            </span>
          </p> */}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {attempt.questions?.length ? (
          attempt.questions.map((q, index) => (
            <ExpandableQuestionCard
              key={q.question_id}
              question={q}
              index={index}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No questions available</p>
        )}
      </div>
    </div>
  );
}

function ExpandableQuestionCard({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="border rounded-lg p-3 shadow-sm hover:bg-gray-50 cursor-pointer bg-white"
    >
      {/* Compact View */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          {index + 1}. {question.question_text}
        </p>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            question.is_correct
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {question.is_correct ? "Correct" : "Wrong"}
        </span>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2 text-sm"
          >
            <div className="border-t pt-2">
              <p>
                <span className="font-medium">Your Answer:</span>{" "}
                {question.user_selected_options?.join(", ") || "—"}
              </p>
              <p>
                <span className="font-medium">Correct Answer:</span>{" "}
                <span className="text-green-600">
                  {question.correct_options?.join(", ")}
                </span>
              </p>
              <p>
                <span className="font-medium">Marks:</span> {question.marks}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

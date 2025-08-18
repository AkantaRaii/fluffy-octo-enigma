"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/QuestionOption";
import DateText from "@/utils/DateText";

interface Props {
  question: Question;
  button?: React.ReactNode;
}

export default function ExpandableQuestionCard({ question, button }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="border rounded-lg p-3 shadow-sm hover:bg-gray-50 cursor-pointer bg-white"
    >
      {/* Small View (always visible) */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{question.text}</p>
          <p className="text-xs text-gray-500">
            Dept: {question.department_names?.join(", ") || "N/A"}
          </p>
        </div>
        {button}
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2"
          >
            <div className="border-t pt-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{question.text}</h4>
                <span className="text-sm text-gray-500">
                  Marks: {question.marks}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Departments:{" "}
                {question.department_names?.length
                  ? question.department_names.join(", ")
                  : "—"}
              </p>

              <div className="space-y-1 mb-2">
                {question.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`px-2 py-1 rounded-md text-sm ${
                      opt.is_correct
                        ? "bg-theme text-white font-medium"
                        : "bg-gray-200"
                    }`}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  By {question.created_by_email} •{" "}
                  <DateText date={question.created_at} />
                </p>
                {button}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
